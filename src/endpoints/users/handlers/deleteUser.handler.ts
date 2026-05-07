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

export const deleteUserHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req,
  res
) => {
  const jwtPayload = (req as any).user;
  const authenticatedUserId = jwtPayload?.user?.id || jwtPayload?.id;
  const { id } = req.params;
  const userId = parseInt(id);

  if (!authenticatedUserId) {
    res.status(401).json({ message: DELETE_USER_UNAUTHORIZED });
    return;
  }

  if (authenticatedUserId === userId) {
    res.status(400).json({ message: DELETE_USER_CANNOT_DELETE_SELF });
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    const requester = await User.findOne({
      where: { id: authenticatedUserId },
      attributes: ['id', 'templeId'],
      include: [{ model: Role, attributes: ['name'] }],
      transaction
    });

    const roleName = requester?.role?.name;

    if (!requester || (roleName !== 'company_superadmin' && roleName !== 'superadmin')) {
      await transaction.rollback();
      res.status(403).json({ message: DELETE_USER_FORBIDDEN });
      return;
    }

    const user = await User.findOne({
      where: { id: userId },
      transaction
    });

    if (!user) {
      await transaction.rollback();
      res.status(404).json({ message: DELETE_USER_NOT_FOUND });
      return;
    }

    // Superadmin can only delete users in their own temple
    if (roleName === 'superadmin' && user.templeId !== requester.templeId) {
      await transaction.rollback();
      res.status(403).json({ message: DELETE_USER_FORBIDDEN });
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
