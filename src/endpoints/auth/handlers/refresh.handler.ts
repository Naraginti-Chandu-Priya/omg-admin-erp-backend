import {
  EndpointAuthType,
  EndpointRequestType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { User, Session, Role, Permission } from 'db';
import {
  AUTH_INVALID_CREDENTIALS,
  AUTH_LOGIN_ERROR,
  REFRESH_TOKEN_AGE
} from '../auth.const';
import { hashToken } from '../auth.helpers';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  JwtPayload
} from 'utils/jwtGenerator';
import { randomUUID } from 'crypto';

export const refreshHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req: EndpointRequestType[EndpointAuthType.NONE],
  res: Response
) => {
  try {
    const oldRefreshToken =
      req.body?.refreshToken || req.headers['x-refresh-token'];

    if (!oldRefreshToken) {
      res.status(401).json({ message: AUTH_INVALID_CREDENTIALS + 1 });
      return;
    }

    let decodedToken;
    try {
      decodedToken = await verifyRefreshToken(oldRefreshToken);
    } catch {
      res.status(401).json({ message: AUTH_INVALID_CREDENTIALS + 2 });
      return;
    }

    const userModel = await User.findOne({
      where: { id: decodedToken.id },
      include: [
        { model: Role },
        {
          model: Permission,
          as: 'userPermissions',
          attributes: ['route', 'access'],
          through: { attributes: [] }
        }
      ]
    });

    const user = userModel?.get({ plain: true });

    if (!user || user.accountStatus !== 'active') {
      res.status(401).json({ message: AUTH_INVALID_CREDENTIALS + 3 });
      return;
    }

    const oldHash = hashToken(oldRefreshToken);

    const session = await Session.findOne({
      where: { tokenHash: oldHash, userId: user.id }
    });

    if (!session) {
      res.status(401).json({
        message: 'Session compromised'
      });
      return;
    }

    if (
      !decodedToken.sessionId ||
      String(session.id) !== String(decodedToken.sessionId)
    ) {
      res.status(401).json({
        message: 'Session compromised'
      });
      return;
    }

    if (session.expiry < new Date()) {
      await Session.destroy({ where: { id: session.id } });

      res.status(401).json({
        message: AUTH_INVALID_CREDENTIALS + 4
      });
      return;
    }

    await Session.destroy({ where: { id: session.id } });

    const sessionId = randomUUID();
    const payload: JwtPayload = {
      id: user.id,
      sessionId,
      authLevel: decodedToken.authLevel
    };

    if (decodedToken.authLevel === 'L2') {
      payload.email = user.email;
      payload.roleId = user.roleId;
    }

    const accessTokenAge = decodedToken.authLevel === 'L1' ? '5m' : '15m';
    const newAccessToken = generateAccessToken(payload, accessTokenAge);
    const newRefreshToken = generateRefreshToken(payload);

    const newHash = hashToken(newRefreshToken);

    await Session.create({
      id: sessionId,
      userId: user.id,
      tokenHash: newHash,
      expiry: new Date(Date.now() + REFRESH_TOKEN_AGE),
      userAgent: req.headers['user-agent'] as string,
      ipAddress: req.ip
    });

    res.status(200).json({
      message: 'Refresh successful',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        roleId: user.roleId,
        role: user.role,
        userPermissions:
          user.role?.name === 'superadmin'
            ? [{ route: '*', access: 'read_write' }]
            : user.userPermissions,
        isFirstLogin: user.isFirstLogin
      }
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: AUTH_LOGIN_ERROR });
    return;
  }
};
