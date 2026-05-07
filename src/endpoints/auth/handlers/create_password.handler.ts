import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { CreatePassword, User } from 'db';
import { decodeSecretToken } from 'endpoints/users/userManagement.helpers';
import {
  EndpointAuthType,
  EndpointHandler,
  sequelize
} from 'node-server-engine';

export const createPasswordHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { hash, password } = req.body;

    if (!hash || !password) {
      await transaction.rollback();
      res.status(400).json({ error: 'Missing fields' });
      return;
    }

    if (typeof password !== 'string' || password.length < 8) {
      await transaction.rollback();
      res
        .status(400)
        .json({ error: 'Password must be at least 8 characters long' });
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
      res.status(400).json({ error: 'Token not found or already used' });
      return;
    }

    const expiry = new Date(decoded.exp);
    if (expiry < new Date()) {
      await tokenRecord.destroy({ transaction });
      await transaction.commit();

      res.status(400).json({
        error: 'Link expired. Please request a new invite.'
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

    if (!user.isFirstLogin) {
      await transaction.rollback();
      res.status(400).json({
        error: 'Password already set. Please login.'
      });
      return;
    }

    const tokenHashBuffer = Buffer.from(decoded.passwordHash);
    const storedHashBuffer = Buffer.from(user.password);
    const isTempPasswordValid =
      tokenHashBuffer.length === storedHashBuffer.length &&
      crypto.timingSafeEqual(tokenHashBuffer, storedHashBuffer);

    if (!isTempPasswordValid) {
      await transaction.rollback();
      res.status(400).json({
        error: 'Invalid temporary password. Please request a new invite.'
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.lastLogin = new Date();

    await user.save({ transaction });

    await tokenRecord.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({
      message: 'Password set successfully'
    });
    return;
  } catch {
    await transaction.rollback();

    res.status(500).json({
      error: 'Internal server error'
    });
    return;
  }
};
