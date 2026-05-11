import {
  EndpointAuthType,
  EndpointRequestType,
  EndpointHandler,
  reportError,
  sequelize
} from 'node-server-engine';
import { Response } from 'express';
import { CreatePassword, Role, Temple, User } from 'db';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { sendMail } from '../../utils/mailer';
import { onBoardTemplateAdmin } from '../users/userManagement.template';
import { generateSecretToken } from '../users/userManagement.helpers';
import { CreateSecret } from '../users/userManagement.types';

// POST /temples - Create temple and its superadmin
export const createTempleHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  const { name, address, city, state, country, logo, superadmin } = req.body;
  const requester = req.user;

  const transaction = await sequelize.transaction();

  try {
    // 1. Create the Temple
    const templeCode = nanoid(8).toUpperCase(); // Generate a unique code
    const temple = await Temple.create({
      name, 
      code: templeCode, 
      address, city, state, country, logo,
      status: 'active',
      createdBy: requester?.id
    }, { transaction });

    // 2. Find the Superadmin role
    const superadminRole = await Role.findOne({
      where: { name: 'superadmin' },
      transaction
    });

    if (!superadminRole) {
      throw new Error('Superadmin role not found');
    }

    // 3. Create the Superadmin User
    const tempPassword = nanoid(12);
    const tempPasswordHash = await bcrypt.hash(tempPassword, 10);

    const createdSuperadmin = await User.create({
      firstName: superadmin.firstName,
      lastName: superadmin.lastName,
      email: superadmin.email,
      phoneNumber: superadmin.phoneNumber || superadmin.phonenumber, // Handle both casing
      isFirstLogin: true,
      password: tempPasswordHash,
      roleId: superadminRole.id,
      templeId: temple.id,
      createdBy: requester?.id,
      updatedBy: requester?.id,
      accountStatus: 'active',
      mfaCode: '',
      mfaFailedCount: 0
    }, { transaction });

    // 4. Generate Password Creation Token
    const tokenPayload: CreateSecret = {
      userId: createdSuperadmin.id,
      exp: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
      passwordHash: tempPasswordHash
    };

    const rawToken = generateSecretToken(tokenPayload);

    await CreatePassword.create({
      userId: createdSuperadmin.id,
      hash: rawToken,
      exp: tokenPayload.exp
    }, { transaction });

    await transaction.commit();

    // 5. Send Onboarding Email
    const mailSent = await sendMail({
      to: superadmin.email,
      subject: 'Welcome to OMG Temple ERP - Account Setup',
      html: await onBoardTemplateAdmin(superadmin.firstName, superadmin.lastName, rawToken)
    });

    res.status(201).json({
      message: 'Temple and Superadmin created successfully',
      temple,
      superadminId: createdSuperadmin.id,
      mailSent
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    reportError(error);
    res.status(500).json({ message: 'Error creating temple and superadmin', error: (error as Error).message });
  }
};

// GET /temples - Get all temples
export const getAllTemplesHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  _req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  try {
    const temples = await Temple.findAll();
    res.status(200).json({ temples });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Error fetching temples', error });
  }
};

// GET /temples/:id - Get temple by ID with its users
export const getTempleByIdHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  const { id } = req.params;
  try {
    const temple = await Temple.findByPk(id, { include: [User] });
    if (!temple) {
      res.status(404).json({ message: 'Temple not found' });
      return;
    }
    res.status(200).json({ temple });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Error fetching temple', error });
  }
};

// PUT /temples/:id - Update temple
export const updateTempleHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const temple = await Temple.findByPk(id);
    if (!temple) {
      res.status(404).json({ message: 'Temple not found' });
      return;
    }
    await temple.update(updates);
    res.status(200).json({ message: 'Temple updated', temple });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Error updating temple', error });
  }
};

// PATCH /temples/:id/status - Update temple status
export const updateTempleStatusHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const temple = await Temple.findByPk(id);
    if (!temple) {
      res.status(404).json({ message: 'Temple not found' });
      return;
    }
    temple.status = status;
    await temple.save();
    res.status(200).json({ message: 'Temple status updated', temple });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Error updating temple status', error });
  }
};

// DELETE /temples/:id - Delete temple
export const deleteTempleHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  const { id } = req.params;
  try {
    const temple = await Temple.findByPk(id);
    if (!temple) {
      res.status(404).json({ message: 'Temple not found' });
      return;
    }
    await temple.destroy();
    res.status(200).json({ message: 'Temple deleted successfully' });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Error deleting temple', error });
  }
};
