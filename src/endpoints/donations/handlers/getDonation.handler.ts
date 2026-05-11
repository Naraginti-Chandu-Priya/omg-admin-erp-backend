import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Donation } from 'db';
import {
  ADD_DONATION_ERROR,
  ADD_DONATION_UNAUTHORIZED,
  DONATION_NOT_FOUND
} from '../donations.const';

export const getDonationHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;
  const { id } = req.params;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_DONATION_UNAUTHORIZED });
    return;
  }

  try {
    const donation = await Donation.findByPk(id);

    if (!donation) {
      res.status(404).json({ message: DONATION_NOT_FOUND });
      return;
    }

    res.json(donation);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: ADD_DONATION_ERROR });
  }
};
