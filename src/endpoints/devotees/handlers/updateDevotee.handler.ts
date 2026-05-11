import {
  EndpointAuthType,
  EndpointHandler,
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
import { persistFamilyMembers } from './utils';
import { ADD_DEVOTEE_ERROR, ADD_DEVOTEE_UNAUTHORIZED } from '../devotees.const';

export const updateDevoteeHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res: Response) => {
  const authenticatedUserId = req.user?.id;
  const { id } = req.params;
  const data = req.body;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_DEVOTEE_UNAUTHORIZED });
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    const devotee = await Devotee.findOne({
      where: { id, isDeleted: false },
      transaction
    });

    if (!devotee) {
      await transaction.rollback();
      res.status(404).json({ message: 'Devotee not found' });
      return;
    }

    await Devotee.update(
      {
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
        updatedBy: authenticatedUserId
      },
      { where: { id }, transaction }
    );

    if (data.nakshatra || data.rasi || data.gothram) {
      const existing = await SpiritualProfile.findOne({
        where: { devoteeId: id },
        transaction
      });

      if (existing) {
        await existing.update(
          {
            nakshatra: data.nakshatra,
            rasi: data.rasi,
            gothram: data.gothram
          },
          { transaction }
        );
      } else {
        await SpiritualProfile.create(
          {
            devoteeId: id,
            nakshatra: data.nakshatra,
            rasi: data.rasi,
            gothram: data.gothram
          },
          { transaction }
        );
      }
    }

    if (data.communicationPreferences) {
      await CommunicationPreference.upsert(
        { devoteeId: id, ...data.communicationPreferences },
        { transaction }
      );
    }

    if (data.reminderPreferences) {
      await ReminderPreference.upsert(
        { devoteeId: id, ...data.reminderPreferences },
        { transaction }
      );
    }

    if (data.familyMembers) {
      await persistFamilyMembers(id, data.familyMembers, transaction);
    }

    await transaction.commit();

    res.json({ message: 'Devotee updated successfully' });
  } catch (error) {
    await transaction.rollback();
    reportError(error);
    res.status(500).json({ message: ADD_DEVOTEE_ERROR });
  }
};
