import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError,
  sequelize
} from 'node-server-engine';
import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { CreatePassword, Role, User } from 'db';
import { nanoid } from 'nanoid';
import { sendMail } from '../../../utils/mailer';
import {
  ONBOARD_ADMIN_EMAIL_EXISTS,
  ONBOARD_ADMIN_ERROR,
  ONBOARD_ADMIN_FORBIDDEN,
  ONBOARD_ADMIN_ROLE_NOT_FOUND,
  ONBOARD_ADMIN_UNAUTHORIZED
} from '../userManagement.const';
import { onBoardTemplateAdmin } from '../userManagement.template';
import { generateSecretToken } from '../userManagement.helpers';
import { CreateSecret } from '../userManagement.types';

export const onboardAdminHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  // node-server-engine JWT wraps payload as { user: { id, ... } }
  const jwtPayload = (req as any).user;
  const authenticatedUserId = jwtPayload?.user?.id || jwtPayload?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ONBOARD_ADMIN_UNAUTHORIZED });
    return;
  }

  const { firstName, lastName, email, phoneNumber } =
    req.body;

  const transaction = await sequelize.transaction();

  try {
    const requester = await User.findOne({
      where: { id: authenticatedUserId },
      include: [{ model: Role, attributes: ['name'] }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!requester || requester.role?.name !== 'superadmin') {
      await transaction.rollback();
      res.status(403).json({ message: ONBOARD_ADMIN_FORBIDDEN });
      return;
    }

    const adminRole = await Role.findOne({
      where: { name: 'admin' },
      transaction
    });

    if (!adminRole) {
      await transaction.rollback();
      res.status(500).json({ message: ONBOARD_ADMIN_ROLE_NOT_FOUND });
      return;
    }

    const existingUser = await User.findOne({
      where: { email },
      transaction
    });

    if (existingUser) {
      await transaction.rollback();
      res.status(409).json({ message: ONBOARD_ADMIN_EMAIL_EXISTS });
      return;
    }

    const tempPassword = nanoid(12);
    const tempPasswordHash = await bcrypt.hash(tempPassword, 10);

    const createdAdmin = await User.create(
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        isFirstLogin: true,
        password: tempPasswordHash,
        roleId: adminRole.id,
        templeId: requester.templeId, // Admin always belongs to the superadmin's temple
        createdBy: requester.id,
        updatedBy: requester.id,
        accountStatus: 'active',
        mfaCode: '',
        mfaFailedCount: 0
      },
      { transaction }
    );

    // Permissions are handled via RolePermission now, no direct UserPermission assignment

    const tokenPayload: CreateSecret = {
      userId: createdAdmin.id,
      exp: new Date(Date.now() + 72 * 60 * 60 * 1000),
      passwordHash: tempPasswordHash
    };

    const rawToken = generateSecretToken(tokenPayload);

    await CreatePassword.create(
      {
        userId: createdAdmin.id,
        hash: rawToken,
        exp: tokenPayload.exp
      },
      { transaction }
    );

    await transaction.commit();

    const mailSent = await sendMail({
      to: email,
      subject: 'Welcome to OMG Temple ERP',
      html: await onBoardTemplateAdmin(firstName, lastName, rawToken)
    });

    res.status(201).json({
      id: createdAdmin.id,
      email: createdAdmin.email,
      role: adminRole.name,
      mailSent
    });
    return;
  } catch (error) {
    try {
      await transaction.rollback();
    } catch {
      reportError('Rollback failed in onboardAdminHandler');
    }

    reportError(error);

    res.status(500).json({
      message: ONBOARD_ADMIN_ERROR
    });
    return;
  }
};
