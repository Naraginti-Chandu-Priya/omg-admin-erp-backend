import {
  EndpointAuthType,
  EndpointRequestType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { WhereOptions, Op } from 'sequelize';
import { Role, User } from 'db';
import {
  GET_USERS_UNAUTHORIZED,
  GET_USERS_FORBIDDEN,
  GET_USERS_ERROR
} from '../userManagement.const';

function parsePositiveInteger(value: unknown, fallback: number): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
}

export const getAllUsersHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  const jwtPayload = (req as any).user;
  const authenticatedUserId = jwtPayload?.user?.id || jwtPayload?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: GET_USERS_UNAUTHORIZED });
    return;
  }

  try {
    const requester = await User.findOne({
      where: { id: authenticatedUserId },
      attributes: ['id', 'templeId'],
      include: [
        {
          model: Role,
          attributes: ['name']
        }
      ]
    });

    if (!requester) {
      res.status(403).json({ message: GET_USERS_FORBIDDEN });
      return;
    }

    const roleName = requester.role?.name;

    // Only company_superadmin and superadmin can list users
    if (roleName !== 'company_superadmin' && roleName !== 'superadmin') {
      res.status(403).json({ message: GET_USERS_FORBIDDEN });
      return;
    }

    const {
      page = 1,
      limit = 10,
      search,
      status,
      roleId
    } = req.query as Record<string, unknown>;

    const currentPage = parsePositiveInteger(page, 1);
    const requestedLimit = parsePositiveInteger(limit, 10);
    const pageSize = Math.min(requestedLimit, 100);
    const offset = (currentPage - 1) * pageSize;
    const searchTerm = typeof search === 'string' ? search.trim() : '';

    const searchClause = searchTerm
      ? {
        [Op.or]: [
          { firstName: { [Op.like]: `%${searchTerm}%` } },
          { lastName: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } },
          { phoneNumber: { [Op.like]: `%${searchTerm}%` } }
        ]
      }
      : {};

    const statusClause =
      status === 'active' || status === 'suspended' || status === 'inactive'
        ? { accountStatus: status }
        : {};

    const roleIdClause = roleId ? { roleId: Number(roleId) } : {};

    // company_superadmin sees all users; superadmin sees only users in their temple
    const templeClause =
      roleName === 'company_superadmin'
        ? {}
        : { templeId: requester.templeId };

    const where: WhereOptions<User> = {
      ...searchClause,
      ...statusClause,
      ...roleIdClause,
      ...templeClause
    };

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'accountStatus',
        'isFirstLogin',
        'lastLogin',
        'roleId',
        'templeId',
        'createdAt',
        'updatedAt'
      ],
      include: [
        {
          model: Role,
          attributes: ['id', 'name']
        }
      ],
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = count === 0 ? 0 : Math.ceil(count / pageSize);

    res.status(200).json({
      data: rows.map((user) => ({
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
      })),
      meta: {
        total: count,
        page: currentPage,
        limit: pageSize,
        totalPages,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages
      }
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_USERS_ERROR });
  }
};

export const getAllSuperadminsHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  req.query.roleId = '1';
  return getAllUsersHandler(req, res);
};

export const getAllAdminsHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  req.query.roleId = '2';
  return getAllUsersHandler(req, res);
};
