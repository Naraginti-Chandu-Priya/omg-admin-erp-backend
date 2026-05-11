import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { HallBooking } from 'db';
import { BOOKING_NOT_FOUND, DELETE_BOOKING_ERROR } from '../hallBookings.const';

export const deleteBookingHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const { id } = req.params;

    const booking = await HallBooking.findByPk(id);

    if (!booking) {
      res.status(404).json({ message: BOOKING_NOT_FOUND });
      return;
    }

    await booking.destroy();

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_BOOKING_ERROR });
  }
};
