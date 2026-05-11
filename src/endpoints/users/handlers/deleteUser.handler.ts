import {
  EndpointAuthType,
  EndpointHandler,
  reportError,
  sequelize
} from 'node-server-engine';
import { Role, User } from 'db';
import {
  DELETE_USER_UNAUTHORIZED,
  DELETE_USER_FORBIDDEN,
  DELETE_USER_NOT_FOUND,
  DELETE_USER_CANNOT_DELETE_SELF,
  DELETE_USER_ERROR
} from '../userManagement.const';

export const deleteUserHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req,
  res
) => {
  const authenticatedUserId = req.user?.id;
  const { id } = req.params;
  const userId = parseInt(id);

  if (!authenticatedUserId) {
    res.status(401).json({ message: DELETE_USER_UNAUTHORIZED });
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    const requester = await User.findOne({
      where: { id: authenticatedUserId },
      attributes: ['id'],
      include: [
        {
          model: Role,
          attributes: ['name']
        }
      ],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!requester || requester.role?.name !== 'superadmin') {
      await transaction.rollback();
      res.status(403).json({ message: DELETE_USER_FORBIDDEN });
      return;
    }

    if (userId === authenticatedUserId) {
      await transaction.rollback();
      res.status(400).json({ message: DELETE_USER_CANNOT_DELETE_SELF });
      return;
    }

    const user = await User.findOne({
      where: { id: userId },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!user) {
      await transaction.rollback();
      res.status(404).json({ message: DELETE_USER_NOT_FOUND });
      return;
    }

    await user.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    reportError(error);
    res.status(500).json({ message: DELETE_USER_ERROR });
  }
};
