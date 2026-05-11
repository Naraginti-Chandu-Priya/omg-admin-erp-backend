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

export const updateDonationHandler: EndpointHandler<
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

    await donation.update({
      amount: req.body.amount,
      category: req.body.category,
      donationDate: req.body.donationDate,
      channel: req.body.channel,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentStatus,
      notes: req.body.notes,
      updatedBy: authenticatedUserId
    });

    res.json({ message: 'Donation updated successfully' });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: ADD_DONATION_ERROR });
  }
};
