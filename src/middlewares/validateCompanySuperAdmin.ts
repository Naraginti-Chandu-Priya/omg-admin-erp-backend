import { Request, Response, NextFunction } from 'express';
import { User, Role } from 'db';

export const validateCompanySuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // The node-server-engine JWT middleware sets req.user with the decoded payload
    // generateJwtToken wraps it as { user: { id, email, roleId, ... } }
    const jwtPayload = (req as any).user;
    const userId = jwtPayload?.user?.id || jwtPayload?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: No user in token' });
      return;
    }

    const user = await User.findOne({
      where: { id: userId },
      include: [{ model: Role, attributes: ['id', 'name'] }]
    });

    if (!user || user.role?.name !== 'company_superadmin') {
      res.status(403).json({ message: 'Forbidden: Only Company Superadmins can perform this action' });
      return;
    }

    // Attach the full user to req for downstream handlers
    (req as any).user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error validating company superadmin' });
  }
};
