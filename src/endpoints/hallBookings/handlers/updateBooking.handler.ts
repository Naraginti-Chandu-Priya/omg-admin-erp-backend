import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { HallBooking } from 'db';
import { BOOKING_NOT_FOUND, UPDATE_BOOKING_ERROR } from '../hallBookings.const';

export const updateBookingHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const booking = await HallBooking.findByPk(id);

    if (!booking) {
      res.status(404).json({ message: BOOKING_NOT_FOUND });
      return;
    }

    let addonsAmount = booking.addonsAmount;
    let totalAmount = booking.totalAmount;
    let advanceAmount = booking.advanceAmount;
    let balanceDue = booking.balanceDue;

    if (data.addons || data.baseAmount !== undefined) {
      const addons = data.addons || JSON.parse(booking.addons || '[]');
      addonsAmount = addons.reduce(
        (sum: number, a: { price: number }) => sum + a.price,
        0
      );

      const baseAmount = data.baseAmount ?? Number(booking.baseAmount);
      const festivalCharge =
        data.festivalCharge ?? Number(booking.festivalCharge || 0);

      totalAmount = baseAmount + addonsAmount + festivalCharge;
      advanceAmount = totalAmount * 0.5;
      balanceDue =
        totalAmount - (data.amountPaid ?? Number(booking.amountPaid || 0));
    }

    await booking.update({
      ...data,
      addons: data.addons ? JSON.stringify(data.addons) : booking.addons,
      addonsAmount,
      totalAmount,
      advanceAmount,
      balanceDue
    });

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: UPDATE_BOOKING_ERROR });
  }
};
