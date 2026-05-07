import bcrypt from 'bcryptjs';
import {
  EndpointAuthType,
  EndpointHandler,
  sequelize
} from 'node-server-engine';
import { User, PasswordReset } from 'db';
import { sendMail } from 'utils/mailer';
import { Response } from 'express';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const resetPasswordHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || email.trim() === '') {
      await transaction.rollback();
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const user = await User.findOne({
      where: { email: email.trim() },
      transaction,
      lock: transaction.LOCK.SHARE
    });

    if (!user) {
      await transaction.rollback();
      res.status(200).json({
        success: true,
        message:
          'If an account exists with this email, you will receive a password reset OTP shortly.'
      });
      return;
    }

    if (user.accountStatus !== 'active') {
      await transaction.rollback();
      res.status(403).json({
        error: 'Your account is not active. Please contact support.'
      });
      return;
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const otpHash = await bcrypt.hash(otp, 10);

    await PasswordReset.destroy({
      where: { userId: user.id },
      transaction
    });

    await PasswordReset.create(
      {
        userId: user.id,
        email: user.email,
        otp: otpHash,
        expiresAt,
        attempts: 0,
        isUsed: false
      },
      { transaction }
    );

    const emailSent = await sendMail({
      to: user.email,
      subject: 'Password Reset OTP - OMG Temple ERP',
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
              .otp-box { 
                background-color: #e7f3ff; 
                border: 2px solid #4CAF50; 
                padding: 20px; 
                border-radius: 5px; 
                text-align: center; 
                margin: 20px 0; 
              }
              .otp { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 2px; }
              .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <p>Hello ${user.firstName} ${user.lastName},</p>
              <p>We received a request to reset the password for your OMG Temple ERP account. Use the OTP below to proceed:</p>
              
              <div class="otp-box">
                <div class="otp">${otp}</div>
                <p style="margin: 10px 0; color: #666;">Valid for 10 minutes</p>
              </div>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>Do not share this OTP with anyone</li>
                <li>This OTP will expire in 10 minutes</li>
                <li>If you did not request this, please ignore this email</li>
              </ul>
              
              <p>If you continue to have problems, please contact support.</p>
              
              <div class="footer">
                <p>&copy; 2026 OMG Temple ERP. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    await transaction.commit();

    if (!emailSent) {
      res.status(200).json({
        success: true,
        message:
          'If an account exists with this email, you will receive a password reset OTP shortly.',
        warning: 'Email delivery may have failed. Please try again shortly.'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message:
        'If an account exists with this email, you will receive a password reset OTP shortly.'
    });
  } catch {
    await transaction.rollback();
    res.status(500).json({
      error:
        'An error occurred while processing your request. Please try again.'
    });
  }
};
