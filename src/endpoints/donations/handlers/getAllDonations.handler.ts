import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Donation, Devotee } from 'db';
import {
  ADD_DONATION_ERROR,
  ADD_DONATION_UNAUTHORIZED
} from '../donations.const';

export const getAllDonationsHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_DONATION_UNAUTHORIZED });
    return;
  }

  try {
    const { page = '1', limit = '10' } = req.query as {
      page?: string;
      limit?: string;
    };

    const donations = await Donation.findAll({
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['createdAt', 'DESC']],
      include: [{ model: Devotee, as: 'devotee' }]
    });

    res.json(donations);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: ADD_DONATION_ERROR });
  }
};
