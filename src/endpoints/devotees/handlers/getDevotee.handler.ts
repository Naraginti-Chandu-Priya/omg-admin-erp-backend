import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import {
  Devotee,
  SpiritualProfile,
  CommunicationPreference,
  ReminderPreference,
  FamilyMember,
  User,
  Donation,
  PoojaSeva
} from 'db';

export const getDevoteeHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req,
  res: Response
) => {
  const { id } = req.params;

  try {
    const devotee = await Devotee.findOne({
      where: { id, isDeleted: false },
      include: [
        { model: SpiritualProfile },
        { model: CommunicationPreference },
        { model: ReminderPreference },
        { model: FamilyMember },
        { model: Donation },
        { model: PoojaSeva },
        {
          model: User,
          as: 'createdByUser',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        },
        {
          model: User,
          as: 'updatedByUser',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        }
      ]
    });

    if (!devotee) {
      res.status(404).json({ message: 'Devotee not found' });
      return;
    }

    res.json(devotee);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Devotee not found' });
  }
};
