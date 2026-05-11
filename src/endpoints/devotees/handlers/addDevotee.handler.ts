import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError,
  sequelize
} from 'node-server-engine';
import { Response } from 'express';
import {
  Devotee,
  SpiritualProfile,
  CommunicationPreference,
  ReminderPreference
} from 'db';
import { ADD_DEVOTEE_ERROR, ADD_DEVOTEE_UNAUTHORIZED } from '../devotees.const';
import { persistFamilyMembers } from './utils';
import { nanoid } from 'nanoid';

export const addDevoteeHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req: EndpointRequestType[EndpointAuthType.NONE],
  res: Response
) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_DEVOTEE_UNAUTHORIZED });
    return;
  }

  const data = req.body;
  const transaction = await sequelize.transaction();

  try {
    const devoteeCode = `DEV-${nanoid(6).toUpperCase()}`;

    const devotee = await Devotee.create(
      {
        devoteeCode,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        addressLine: data.addressLine,
        city: data.city,
        state: data.state,
        country: data.country,
        status: data.status,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        occupation: data.occupation,
        membershipType: data.membershipType,
        createdBy: authenticatedUserId,
        updatedBy: authenticatedUserId
      },
      { transaction }
    );

    if (data.nakshatra || data.rasi || data.gothram) {
      await SpiritualProfile.create(
        {
          devoteeId: devotee.id,
          nakshatra: data.nakshatra,
          rasi: data.rasi,
          gothram: data.gothram
        },
        { transaction }
      );
    }

    if (data.communicationPreferences) {
      await CommunicationPreference.create(
        {
          devoteeId: devotee.id,
          ...data.communicationPreferences
        },
        { transaction }
      );
    }

    if (data.reminderPreferences) {
      await ReminderPreference.create(
        {
          devoteeId: devotee.id,
          ...data.reminderPreferences
        },
        { transaction }
      );
    }

    if (data.familyMembers?.length) {
      await persistFamilyMembers(devotee.id, data.familyMembers, transaction);
    }

    await transaction.commit();

    res.status(201).json({
      message: 'Devotee created successfully',
      id: devotee.id,
      devoteeCode: devotee.devoteeCode
    });
  } catch (error) {
    await transaction.rollback();
    reportError(error);

    res.status(500).json({
      message: ADD_DEVOTEE_ERROR
    });
  }
};
