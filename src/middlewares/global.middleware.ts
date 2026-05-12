import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from 'utils/jwtGenerator';
import { User, Session, Role, Permission } from 'db';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | '*';

interface PublicRoute {
  path: string;
  methods: HttpMethod[];
  exact?: boolean;
}

interface UserPermission {
  route: string;
  access: string;
}

const PUBLIC_ROUTES: PublicRoute[] = [
  { path: '/auth/login', methods: ['POST'], exact: true },
  { path: '/auth/refresh', methods: ['POST'], exact: true },
  { path: '/auth/logout', methods: ['POST'], exact: true },
  { path: '/api-docs', methods: ['GET'], exact: false },
  { path: '/auth/create-password', methods: ['POST'], exact: true },
  { path: '/auth/forgot-password', methods: ['POST'], exact: true },
  { path: '/auth/forgot-password/verify', methods: ['POST'], exact: true },
  { path: '/auth/forgot-password/reset', methods: ['POST'], exact: true }
];

const SKIP_PERMISSION_ROUTES = [
  '/auth/mfa/setup',
  '/auth/mfa/confirm',
  '/auth/mfa/verify'
];

const ALLOWED_CONTENT_TYPES = ['application/json', 'multipart/form-data'];

const ROUTE_PERMISSION_MAP: Record<string, string> = {
  devotees: 'devotees',
  donations: 'donations',
  poojasevas: 'pooja-seva',
  halls: 'halls',
  'hall-bookings': 'hall-bookings',
  revenue: 'revenue',
  assets: 'assets',
  parking: 'parking',
  staff: 'staff',
  'temple-events': 'temple-events',
  volunteers: 'volunteers',
  'staff-duties': 'staff-duties',
  annathanam: 'annathanam',
  inventory: 'inventory',
  procurement: 'procurement',
  distribution: 'distribution',
  temples: 'temples',
  users: 'users'

};

function isPublicRoute(req: Request): boolean {
  const method = req.method.toUpperCase() as HttpMethod;
  return PUBLIC_ROUTES.some(({ path, methods, exact }) => {
    const match = exact ? req.path === path : req.path.startsWith(path);
    return match && (methods.includes('*') || methods.includes(method));
  });
}

function deny(res: Response, status: number, message: string): void {
  res.status(status).json({ message });
}

function getToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  return bearer || null;
}

function assertContentType(req: Request): string | null {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) return null;
  const ct = req.headers['content-type'] ?? '';
  const allowed = ALLOWED_CONTENT_TYPES.some((type) => ct.startsWith(type));
  if (!allowed) return 'Unsupported Media Type';
  return null;
}

function isSafePath(req: Request): boolean {
  try {
    const decoded = decodeURIComponent(req.path);
    if (decoded.includes('..')) return false;
    return true;
  } catch {
    return false;
  }
}

function hasPermission(
  method: string,
  path: string,
  permissions: UserPermission[]
): boolean {
  if (permissions.some((p) => p.route === '*')) return true;

  const firstPart = path.split('/')[1];
  const requiredRoute = ROUTE_PERMISSION_MAP[firstPart];

  if (!requiredRoute) return false;

  const permission = permissions.find((p) => p.route === requiredRoute);
  if (!permission) return false;

  if (method === 'GET') {
    return permission.access === 'read' || permission.access === 'read_write';
  }

  return permission.access === 'read_write';
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!isSafePath(req)) {
      deny(res, 400, 'Bad request');
      return;
    }

    const ctViolation = assertContentType(req);
    if (ctViolation) {
      deny(res, 415, ctViolation);
      return;
    }

    if (isPublicRoute(req)) {
      next();
      return;
    }

    const token = getToken(req);
    if (!token) {
      deny(res, 401, 'Authentication required');
      return;
    }

    let decoded: JwtPayload;
    try {
      decoded = verifyAccessToken(token);
    } catch {
      deny(res, 401, 'Invalid or expired token');
      return;
    }

    if (
      decoded.authLevel === 'L1' &&
      !SKIP_PERMISSION_ROUTES.includes(req.path)
    ) {
      deny(res, 403, 'MFA verification required');
      return;
    }

    if (!decoded.sessionId) {
      deny(res, 401, 'Invalid token payload');
      return;
    }

    const session = await Session.findOne({
      where: { id: decoded.sessionId, userId: decoded.id }
    });

    if (!session) {
      deny(res, 401, 'Session invalid');
      return;
    }

    if (session.expiry < new Date()) {
      await Session.destroy({ where: { userId: decoded.id } });
      deny(res, 401, 'Session expired');
      return;
    }

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'roleId', 'accountStatus'],
      include: [
        {
          model: Role,
          attributes: ['name'],
          include: [
            {
              model: Permission,
              as: 'permissions',
              attributes: ['route', 'access'],
              through: { attributes: [] }
            }
          ]
        },
        {
          model: Permission,
          as: 'userPermissions',
          attributes: ['route', 'access'],
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      deny(res, 401, 'User not found');
      return;
    }

    if (user.accountStatus !== 'active') {
      deny(res, 403, 'Account suspended');
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      sessionId: decoded.sessionId,
      authLevel: decoded.authLevel,
      userPermissions:
        user.role?.name === 'company_superadmin' || user.role?.name === 'superadmin'
          ? [{ route: '*', access: 'read_write' }]
          : [
              ...((user as any).userPermissions || []),
              ...((user.role as any)?.permissions || [])
            ]
    };

    if (
      !SKIP_PERMISSION_ROUTES.includes(req.path) &&
      !hasPermission(req.method, req.path, req.user.userPermissions)
    ) {
      deny(res, 403, 'Access denied: Insufficient permissions');
      return;
    }

    next();
  } catch {
    deny(res, 500, 'Internal server error');
  }
};
