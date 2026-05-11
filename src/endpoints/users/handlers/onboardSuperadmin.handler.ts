import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError,
  sequelize
} from 'node-server-engine';
import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { CreatePassword, Role, User, Temple } from 'db';
import { nanoid } from 'nanoid';
import { sendMail } from '../../../utils/mailer';
import {
  ONBOARD_ADMIN_EMAIL_EXISTS,
  ONBOARD_ADMIN_ERROR,
  ONBOARD_ADMIN_ROLE_NOT_FOUND,
  ONBOARD_ADMIN_UNAUTHORIZED
} from '../userManagement.const';
import { onBoardTemplateAdmin } from '../userManagement.template';
import { generateSecretToken } from '../userManagement.helpers';
import { CreateSecret } from '../userManagement.types';

export const onboardSuperadminHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  const jwtPayload = (req as any).user;
  const authenticatedUserId = jwtPayload?.user?.id || jwtPayload?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ONBOARD_ADMIN_UNAUTHORIZED });
    return;
  }

  const { firstName, lastName, email, phoneNumber, templeId } =
    req.body;

  const transaction = await sequelize.transaction();

  try {
    const requester = await User.findOne({
      where: { id: authenticatedUserId },
      include: [{ model: Role, attributes: ['name'] }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    // Only company_superadmin can onboard a temple superadmin
    if (!requester || requester.role?.name !== 'company_superadmin') {
      await transaction.rollback();
      res.status(403).json({ message: 'Forbidden: Only company superadmin can onboard temple superadmins' });
      return;
    }

    const superadminRole = await Role.findOne({
      where: { name: 'superadmin' },
      transaction
    });

    if (!superadminRole) {
      await transaction.rollback();
      res.status(500).json({ message: ONBOARD_ADMIN_ROLE_NOT_FOUND });
      return;
    }

    if (templeId) {
      const temple = await Temple.findByPk(templeId, { transaction });
      if (!temple) {
        await transaction.rollback();
        res.status(404).json({ message: 'Temple not found' });
        return;
      }
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
        roleId: superadminRole.id,
        templeId: templeId || null,
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
      role: superadminRole.name,
      templeId,
      mailSent
    });
    return;
  } catch (error) {
    try {
      await transaction.rollback();
    } catch {
      reportError('Rollback failed in onboardSuperadminHandler');
    }

    reportError(error);

    res.status(500).json({
      message: ONBOARD_ADMIN_ERROR
    });
    return;
  }
};
