import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError,
  sequelize
} from 'node-server-engine';
import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { CreatePassword, Role, User, Permission, UserPermission } from 'db';
import { Op } from 'sequelize';
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
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ONBOARD_ADMIN_UNAUTHORIZED });
    return;
  }

  const { firstName, lastName, email, phoneNumber, routePermissions } =
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
        createdBy: requester.id,
        updatedBy: requester.id,
        accountStatus: 'active'
      },
      { transaction }
    );

    if (Array.isArray(routePermissions) && routePermissions.length > 0) {
      const permissionRecords = await Permission.findAll({
        where: {
          [Op.or]: (
            routePermissions as {
              path?: string;
              route?: string;
              access: string;
            }[]
          ).map((rp) => ({
            route: rp.path || rp.route,
            access: rp.access
          }))
        },
        transaction
      });

      const userPermissionsToInsert = permissionRecords.map((p) => ({
        userId: createdAdmin.id,
        permissionId: p.id
      }));

      if (userPermissionsToInsert.length > 0) {
        await UserPermission.bulkCreate(userPermissionsToInsert, {
          transaction
        });
      }
    }

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
