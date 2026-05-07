import {
  EndpointAuthType,
  EndpointRequestType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Session } from 'db';
import { hashToken } from '../auth.helpers';

export const logoutHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req: EndpointRequestType[EndpointAuthType.NONE],
  res: Response
) => {
  try {
    const refreshToken =
      req.body?.refreshToken || req.headers['x-refresh-token'];

    if (refreshToken) {
      await Session.destroy({
        where: { tokenHash: hashToken(refreshToken) }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
    return;
  } catch (error) {
    reportError(error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
    return;
  }
};
