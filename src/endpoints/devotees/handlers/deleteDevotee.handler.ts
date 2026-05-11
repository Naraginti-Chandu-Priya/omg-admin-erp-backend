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
  ReminderPreference,
  FamilyMember
} from 'db';
import { ADD_DEVOTEE_ERROR, ADD_DEVOTEE_UNAUTHORIZED } from '../devotees.const';

export const deleteDevoteeHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res: Response) => {
  const authenticatedUserId = req.user?.id;
  const { id } = req.params;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_DEVOTEE_UNAUTHORIZED });
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    const devotee = await Devotee.findOne({ where: { id } });

    if (!devotee) {
      await transaction.rollback();
      res.status(404).json({ message: 'Devotee not found' });
      return;
    }

    await SpiritualProfile.destroy({ where: { devoteeId: id }, transaction });
    await CommunicationPreference.destroy({
      where: { devoteeId: id },
      transaction
    });
    await ReminderPreference.destroy({ where: { devoteeId: id }, transaction });
    await FamilyMember.destroy({ where: { devoteeId: id }, transaction });

    await Devotee.destroy({ where: { id }, transaction });
    await transaction.commit();

    res.json({ message: 'Devotee permanently deleted' });
  } catch (error) {
    await transaction.rollback();
    reportError(error);
    res.status(500).json({ message: ADD_DEVOTEE_ERROR });
  }
};
