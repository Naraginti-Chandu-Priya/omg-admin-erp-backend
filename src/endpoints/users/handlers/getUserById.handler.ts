import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Role, User } from 'db';
import {
  GET_USER_UNAUTHORIZED,
  GET_USER_FORBIDDEN,
  GET_USER_NOT_FOUND,
  GET_USER_ERROR
} from '../userManagement.const';

export const getUserByIdHandler: EndpointHandler<
  EndpointAuthType.JWT
> = async (req, res: Response) => {
  const jwtPayload = (req as any).user;
  const authenticatedUserId = jwtPayload?.user?.id || jwtPayload?.id;
  const { id } = req.params;

  if (!authenticatedUserId) {
    res.status(401).json({ message: GET_USER_UNAUTHORIZED });
    return;
  }

  try {
    const requester = await User.findOne({
      where: { id: authenticatedUserId },
      attributes: ['id', 'templeId'],
      include: [{ model: Role, attributes: ['name'] }]
    });

    const roleName = requester?.role?.name;

    if (!requester || (roleName !== 'company_superadmin' && roleName !== 'superadmin')) {
      res.status(403).json({ message: GET_USER_FORBIDDEN });
      return;
    }

    const user = await User.findOne({
      where: { id },
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'phoneNumber',
        'accountStatus', 'isFirstLogin', 'lastLogin', 'roleId',
        'templeId', 'createdAt', 'updatedAt'
      ],
      include: [{ model: Role, attributes: ['id', 'name'] }]
    });

    if (!user) {
      res.status(404).json({ message: GET_USER_NOT_FOUND });
      return;
    }

    // Superadmin can only view users in their own temple
    if (roleName === 'superadmin' && user.templeId !== requester.templeId) {
      res.status(403).json({ message: GET_USER_FORBIDDEN });
      return;
    }

    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      accountStatus: user.accountStatus,
      isFirstLogin: user.isFirstLogin,
      lastLogin: user.lastLogin,
      role: user.role,
      templeId: user.templeId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_USER_ERROR });
  }
};
