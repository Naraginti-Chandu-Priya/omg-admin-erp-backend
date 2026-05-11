import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { HallBooking, Hall, Devotee, User } from 'db';
import { BOOKING_NOT_FOUND, GET_BOOKING_ERROR } from '../hallBookings.const';

export const getBookingHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req: EndpointRequestType[EndpointAuthType.NONE],
  res: Response
) => {
  try {
    const { id } = req.params;

    const booking = await HallBooking.findByPk(id, {
      include: [
        {
          model: Hall,
          attributes: ['id', 'name', 'hallCode', 'capacity']
        },
        {
          model: Devotee,
          attributes: ['id', 'firstName', 'lastName', 'phone', 'email'],
          required: false
        },
        {
          model: User,
          as: 'bookedByUser',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        }
      ]
    });

    if (!booking) {
      res.status(404).json({ message: BOOKING_NOT_FOUND });
      return;
    }

    res.json(booking);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_BOOKING_ERROR });
  }
};
