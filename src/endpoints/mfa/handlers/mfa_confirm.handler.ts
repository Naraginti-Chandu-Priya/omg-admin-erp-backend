import speakeasy from 'speakeasy';
import { User, Session } from 'db';
import {
  EndpointAuthType,
  EndpointHandler,
  reportError,
  sequelize
} from 'node-server-engine';
import {
  generateAccessToken,
  generateRefreshToken,
  JwtPayload
} from 'utils/jwtGenerator';
import { hashToken } from '../../auth/auth.helpers';
import {
  MFA_UNAUTHORIZED,
  MFA_USER_NOT_FOUND,
  MFA_INTERNAL_ERROR,
  MFA_TOTP_REQUIRED,
  MFA_SETUP_NOT_INITIATED,
  MFA_ENABLED_SUCCESS,
  MFA_ACCOUNT_LOCKED,
  MFA_INVALID_TOTP,
  MAX_MFA_ATTEMPTS,
  LOCKOUT_DURATION_MS
} from '../mfa.const';

export const mfaConfirmHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req,
  res
) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ error: MFA_UNAUTHORIZED });
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    const { totp } = req.body;

    if (!totp) {
      await transaction.rollback();
      res.status(400).json({ error: MFA_TOTP_REQUIRED });
      return;
    }

    const user = await User.findByPk(authenticatedUserId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!user) {
      await transaction.rollback();
      res.status(404).json({ error: MFA_USER_NOT_FOUND });
      return;
    }

    if (!user.mfaCode) {
      await transaction.rollback();
      res.status(400).json({ error: MFA_SETUP_NOT_INITIATED });
      return;
    }

    if (
      user.mfaAccountLockedUntil &&
      new Date(user.mfaAccountLockedUntil) > new Date()
    ) {
      await transaction.rollback();
      res.status(429).json({
        error: MFA_ACCOUNT_LOCKED,
        lockedUntil: new Date(user.mfaAccountLockedUntil).toLocaleString(
          'en-IN',
          {
            timeZone: 'Asia/Kolkata'
          }
        )
      });
      return;
    }

    const isValid = speakeasy.totp.verify({
      secret: user.mfaCode,
      encoding: 'base32',
      token: totp,
      window: 1
    });

    if (!isValid) {
      user.mfaFailedCount += 1;

      if (user.mfaFailedCount >= MAX_MFA_ATTEMPTS) {
        user.mfaAccountLockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
      }

      await user.update(
        {
          mfaFailedCount: user.mfaFailedCount,
          mfaAccountLockedUntil: user.mfaAccountLockedUntil
        },
        { transaction }
      );
      await transaction.commit();

      res.status(401).json({ error: MFA_INVALID_TOTP });
      return;
    }

    await user.update(
      {
        mfaFailedCount: 0,
        mfaAccountLockedUntil: null,
        isFirstLogin: false
      },
      { transaction }
    );

    const sessionId = req.user?.sessionId;
    if (!sessionId) {
      await transaction.rollback();
      res.status(401).json({ error: MFA_UNAUTHORIZED });
      return;
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      templeId: user.templeId,
      isFirstLogin: user.isFirstLogin,
      sessionId,
      authLevel: 'L2'
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await Session.update(
      { tokenHash: hashToken(refreshToken) },
      { where: { id: sessionId }, transaction }
    );

    await transaction.commit();

    res.status(200).json({
      message: MFA_ENABLED_SUCCESS,
      accessToken,
      refreshToken
    });
    return;
  } catch (error) {
    await transaction.rollback();
    reportError(error);
    res.status(500).json({ error: MFA_INTERNAL_ERROR });
    return;
  }
};
