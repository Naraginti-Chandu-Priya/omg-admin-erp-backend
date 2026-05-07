import bcrypt from 'bcryptjs';
import {
  EndpointAuthType,
  EndpointHandler,
  sequelize
} from 'node-server-engine';
import { User, PasswordReset, CreatePassword } from 'db';
import { generateSecretToken } from 'endpoints/users/userManagement.helpers';
import { Response } from 'express';

export const verifyOtpResetPasswordHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      await transaction.rollback();
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const resetRecord = await PasswordReset.findOne({
      where: { email: email.trim(), isUsed: false },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!resetRecord) {
      await transaction.rollback();
      res.status(400).json({
        error: 'Invalid email or OTP'
      });
      return;
    }

    const isOtpValid = await bcrypt.compare(otp, resetRecord.otp);
    if (!isOtpValid) {
      resetRecord.attempts += 1;
      await resetRecord.save({ transaction });
      await transaction.commit();
      res.status(400).json({
        error: 'Invalid email or OTP'
      });
      return;
    }

    if (new Date() > resetRecord.expiresAt) {
      await resetRecord.destroy({ transaction });
      await transaction.commit();
      res.status(400).json({
        error: 'OTP has expired. Please request a new password reset.'
      });
      return;
    }

    if (resetRecord.attempts >= resetRecord.maxAttempts) {
      await resetRecord.destroy({ transaction });
      await transaction.commit();
      res.status(400).json({
        error:
          'Maximum OTP verification attempts exceeded. Please request a new password reset.'
      });
      return;
    }

    const user = await User.findOne({
      where: { id: resetRecord.userId },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!user) {
      await transaction.rollback();
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const tempPassword = Math.random().toString(36).slice(-10);
    const tempPasswordHash = await bcrypt.hash(tempPassword, 10);

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const secretToken = generateSecretToken({
      userId: user.id,
      exp: expiresAt,
      passwordHash: tempPasswordHash
    });

    await CreatePassword.create(
      {
        userId: user.id,
        hash: secretToken,
        exp: expiresAt
      },
      { transaction }
    );

    resetRecord.isUsed = true;
    await resetRecord.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message:
        'OTP verified successfully. Use the hash to create your new password.'
    });
  } catch {
    await transaction.rollback();
    res.status(500).json({
      error: 'An error occurred while verifying your OTP. Please try again.'
    });
  }
};
