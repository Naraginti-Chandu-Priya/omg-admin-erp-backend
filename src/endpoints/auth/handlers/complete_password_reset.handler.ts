import bcrypt from 'bcryptjs';
import { CreatePassword, User, Session } from 'db';
import { decodeSecretToken } from 'endpoints/users/userManagement.helpers';
import { sendMail } from 'utils/mailer';
import {
  EndpointAuthType,
  EndpointHandler,
  sequelize
} from 'node-server-engine';
import { Response } from 'express';
import { PasswordReset } from 'db';

export const completePasswordResetHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const { hash, password } = req.body;

    if (!hash || !password) {
      await transaction.rollback();
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (typeof password !== 'string' || password.length < 8) {
      await transaction.rollback();
      res.status(400).json({
        error: 'Password must be at least 8 characters long'
      });
      return;
    }

    const decoded = await decodeSecretToken(hash);

    if (!decoded || !decoded.userId || !decoded.exp || !decoded.passwordHash) {
      await transaction.rollback();
      res.status(400).json({ error: 'Invalid or tampered hash' });
      return;
    }

    const tokenRecord = await CreatePassword.findOne({
      where: { userId: decoded.userId, hash },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!tokenRecord) {
      await transaction.rollback();
      res.status(400).json({
        error:
          'Token not found or already used. Please request a new password reset.'
      });
      return;
    }

    const expiry = new Date(decoded.exp);
    if (expiry < new Date()) {
      await tokenRecord.destroy({ transaction });
      await transaction.commit();

      res.status(400).json({
        error: 'Password reset link expired. Please request a new reset.'
      });
      return;
    }

    const user = await User.findOne({
      where: { id: decoded.userId },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!user) {
      await transaction.rollback();
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetCount = (user.passwordResetCount || 0) + 1;
    await user.save({ transaction });

    await tokenRecord.destroy({ transaction });

    await Session.destroy({
      where: { userId: user.id },
      transaction
    });

    await PasswordReset.destroy({
      where: { userId: user.id },
      transaction
    });

    await transaction.commit();

    await sendMail({
      to: user.email,
      subject: 'Password Reset Successful - OMG Temple ERP',
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
              .content { padding: 20px 0; }
              .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Successful</h1>
              </div>
              <div class="content">
                <p>Hello ${user.firstName} ${user.lastName},</p>
                <p>Your password has been successfully reset.</p>
              
                <p>If you did not reset your password, please contact support immediately.</p>
              </div>
              <div class="footer">
                <p>&copy; 2026 OMG Temple ERP. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    res.status(200).json({
      success: true,
      message:
        'Password reset successfully. You can now login with your new password.'
    });
  } catch {
    await transaction.rollback();
    res.status(500).json({
      error:
        'An error occurred while resetting your password. Please try again.'
    });
  }
};
