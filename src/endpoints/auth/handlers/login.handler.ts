import {
  EndpointAuthType,
  EndpointRequestType,
  EndpointHandler,
  reportError,
  generateJwtToken
} from 'node-server-engine';
import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { User, Role, Session } from 'db';
import {
  AUTH_INVALID_CREDENTIALS,
  AUTH_LOGIN_ERROR,
  REFRESH_TOKEN_AGE
} from '../auth.const';
import { hashToken } from '../auth.helpers';
import {
  generateRefreshToken,
  verifyRefreshToken
} from 'utils/jwtGenerator';
import { randomUUID } from 'crypto';

export const loginHandler: EndpointHandler<EndpointAuthType> = async (
  req: EndpointRequestType[EndpointAuthType],
  res: Response
) => {
  const { email, password } = req.body;

  try {
    const userModel = await User.findOne({
      where: { email },
      include: [
        { model: Role }
      ]
    });
    const user = userModel?.get({ plain: true });

    if (!user) {
      res.status(401).json({ message: AUTH_INVALID_CREDENTIALS });
      return;
    }

    if (user.accountStatus !== 'active') {
      res.status(403).json({ message: 'Account disabled' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: AUTH_INVALID_CREDENTIALS });
      return;
    }

    const oldRefreshToken =
      req.body?.refreshToken || req.headers['x-refresh-token'];
    if (oldRefreshToken) {
      try {
        const decodedToken = verifyRefreshToken(oldRefreshToken);
        if (decodedToken && String(decodedToken.id) === String(user.id)) {
          const oldHash = hashToken(oldRefreshToken);
          const session = await Session.findOne({
            where: { tokenHash: oldHash, userId: user.id }
          });

          if (!session) {
            await Session.destroy({ where: { userId: user.id } });
            res.status(401).json({ message: 'Session compromised' });
            return;
          }
        }
      } catch {
        res.status(401).json({ message: AUTH_INVALID_CREDENTIALS });
        return;
      }
    }

    await Session.destroy({ where: { userId: user.id } });

    const sessionId = randomUUID();

    const accessToken = generateJwtToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      templeId: user.templeId,
      isFirstLogin: user.isFirstLogin
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      sessionId,
      authLevel: 'L1'
    });

    await Session.create({
      id: sessionId,
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiry: new Date(Date.now() + REFRESH_TOKEN_AGE),
      userAgent: req.headers['user-agent'] as string,
      ipAddress: req.ip
    });

    await User.update(
      { lastLogin: new Date() },
      { where: { id: user.id }, silent: true }
    );

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        role: user.role,
        templeId: user.templeId,
        isFirstLogin: user.isFirstLogin
      }
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: AUTH_LOGIN_ERROR });
    return;
  }
};
