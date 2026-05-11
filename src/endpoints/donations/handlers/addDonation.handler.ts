import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Donation } from 'db';
import { nanoid } from 'nanoid';
import {
  ADD_DONATION_ERROR,
  ADD_DONATION_UNAUTHORIZED
} from '../donations.const';

export const addDonationHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_DONATION_UNAUTHORIZED });
    return;
  }

  try {
    const donationCode = `DON-${nanoid(6).toUpperCase()}`;
    const transactionRef = `TXN-${nanoid(6).toUpperCase()}`;
    const receiptNumber = `REC-${nanoid(6).toUpperCase()}`;

    const data = req.body;

    const donation = await Donation.create({
      devoteeId: data.devoteeId,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      amount: data.amount,
      category: data.category,
      donationDate: data.donationDate,
      channel: data.channel,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      notes: data.notes,
      donationCode,
      transactionRef,
      receiptNumber,
      createdBy: authenticatedUserId,
      updatedBy: authenticatedUserId
    });

    res.status(201).json({
      message: 'Donation created successfully',
      id: donation.id,
      donationCode,
      transactionRef,
      receiptNumber
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: ADD_DONATION_ERROR });
  }
};
