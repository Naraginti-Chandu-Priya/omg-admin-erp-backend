import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { WhereOptions, Op } from 'sequelize';
import { HallBooking, Hall, Devotee, User } from 'db';
import { GET_BOOKINGS_ERROR } from '../hallBookings.const';

export const getBookingsByMonthHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const { month, year } = req.body as Record<string, unknown>;

    if (!month || !year) {
      res.status(400).json({
        success: false,
        error: 'Month and year parameters are required'
      });
      return;
    }

    const monthNum = parseInt(String(month), 10);
    const yearNum = parseInt(String(year), 10);

    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      res.status(400).json({
        success: false,
        error: 'Invalid month or year format.'
      });
      return;
    }

    const startOfMonth = new Date(yearNum, monthNum - 1, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const where: WhereOptions<HallBooking> = {
      eventDate: {
        [Op.between]: [startOfMonth, endOfMonth]
      }
    };

    const bookings = await HallBooking.findAll({
      where,
      include: [
        { model: Hall, attributes: ['id', 'name', 'hallCode'] },
        {
          model: Devotee,
          attributes: ['id', 'firstName', 'lastName', 'phone'],
          required: false
        },
        {
          model: User,
          as: 'bookedByUser',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        }
      ],

      order: [['eventDate', 'ASC']]
    });

    const slotOrder: Record<string, number> = {
      half_day_morning: 1,
      full_day: 2,
      half_day_evening: 3
    };

    const sortedBookings = bookings.sort((a, b) => {
      const dateDiff =
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();

      if (dateDiff !== 0) return dateDiff;

      return (slotOrder[a.slot] || 99) - (slotOrder[b.slot] || 99);
    });

    const bookingsByDate: Record<string, typeof bookings> = {};

    sortedBookings.forEach((booking) => {
      const dateKey = new Date(booking.eventDate).toISOString().split('T')[0];

      if (!bookingsByDate[dateKey]) {
        bookingsByDate[dateKey] = [];
      }

      bookingsByDate[dateKey].push(booking);
    });

    res.status(200).json({
      success: true,
      data: bookingsByDate,
      meta: {
        total: bookings.length,
        month: monthNum,
        year: yearNum
      }
    });
    return;
  } catch (error) {
    reportError(error);

    res.status(500).json({
      success: false,
      error: GET_BOOKINGS_ERROR
    });
    return;
  }
};
