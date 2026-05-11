import {
  EndpointAuthType,
  EndpointHandler,
  reportError,
  sequelize
} from 'node-server-engine';
import { Response } from 'express';
import { Op } from 'sequelize';
import { Role, User } from 'db';
import {
  UPDATE_USER_UNAUTHORIZED,
  UPDATE_USER_FORBIDDEN,
  UPDATE_USER_NOT_FOUND,
  UPDATE_USER_EMAIL_EXISTS,
  UPDATE_USER_ERROR
} from '../userManagement.const';

export const updateUserHandler: EndpointHandler<EndpointAuthType.NONE> = async (req, res: Response) => {
  const jwtPayload = (req as any).user;
  const authenticatedUserId = jwtPayload?.user?.id || jwtPayload?.id;
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    accountStatus
  } = req.body;

  if (!authenticatedUserId) {
    res.status(401).json({ message: UPDATE_USER_UNAUTHORIZED });
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    const requester = await User.findOne({
      where: { id: authenticatedUserId },
      attributes: ['id', 'templeId'],
      include: [{ model: Role, attributes: ['name'] }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    const roleName = requester?.role?.name;

    if (!requester || (roleName !== 'company_superadmin' && roleName !== 'superadmin')) {
      await transaction.rollback();
      res.status(403).json({ message: UPDATE_USER_FORBIDDEN });
      return;
    }

    const user = await User.findOne({
      where: { id },
      include: [{ model: Role, attributes: ['name'] }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!user) {
      await transaction.rollback();
      res.status(404).json({ message: UPDATE_USER_NOT_FOUND });
      return;
    }

    // Superadmin can only update users in their own temple
    if (roleName === 'superadmin' && user.templeId !== requester.templeId) {
      await transaction.rollback();
      res.status(403).json({ message: UPDATE_USER_FORBIDDEN });
      return;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: { email, id: { [Op.ne]: id } },
        attributes: ['id'],
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (existingUser) {
        await transaction.rollback();
        res.status(409).json({ message: UPDATE_USER_EMAIL_EXISTS });
        return;
      }
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (accountStatus) user.accountStatus = accountStatus;
    user.updatedBy = authenticatedUserId;

    await user.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      accountStatus: user.accountStatus,
      templeId: user.templeId,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    await transaction.rollback();
    reportError(error);
    res.status(500).json({ message: UPDATE_USER_ERROR });
  }
};
