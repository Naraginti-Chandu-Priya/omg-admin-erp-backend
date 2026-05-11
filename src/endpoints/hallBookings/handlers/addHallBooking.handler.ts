import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { HallBooking } from 'db';
import { nanoid } from 'nanoid';
import { ADD_BOOKING_ERROR } from '../hallBookings.const';

export const addHallBookingHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  const authenticatedUserId = req.user?.id;
  try {
    const data = req.body;

    const bookingCode = `HBK-${nanoid(5).toUpperCase()}`;

    const addons = data.addons || [];
    const addonsAmount = addons.reduce(
      (sum: number, a: { price: number }) => sum + a.price,
      0
    );

    const totalAmount =
      data.baseAmount + addonsAmount + (data.festivalCharge || 0);

    const advanceAmount = totalAmount * 0.5;

    const booking = await HallBooking.create({
      ...data,
      bookingCode,
      addons: JSON.stringify(addons),
      addonsAmount,
      totalAmount,
      advanceAmount,
      balanceDue: totalAmount - (data.amountPaid || 0),
      bookedBy: authenticatedUserId
    });

    res.status(201).json(booking);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: ADD_BOOKING_ERROR });
  }
};
