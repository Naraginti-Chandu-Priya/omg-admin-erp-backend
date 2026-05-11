import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { WhereOptions, Op } from 'sequelize';
import { HallBooking, Hall, Devotee, User } from 'db';
import { parsePositiveInteger } from './utils';
import { GET_BOOKINGS_ERROR } from '../hallBookings.const';

export const getAllBookingsHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentStatus,
      eventDate
    } = req.query as Record<string, unknown>;

    const currentPage = parsePositiveInteger(page, 1);
    const requestedLimit = parsePositiveInteger(limit, 10);
    const pageSize = Math.min(requestedLimit, 100);
    const offset = (currentPage - 1) * pageSize;

    const searchClause = search
      ? {
          [Op.or]: [
            { bookerName: { [Op.like]: `%${search}%` } },
            { bookerPhone: { [Op.like]: `%${search}%` } },
            { bookerEmail: { [Op.like]: `%${search}%` } },
            { bookingCode: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const statusClause = status ? { status: String(status) } : {};
    const paymentClause = paymentStatus
      ? { paymentStatus: String(paymentStatus) }
      : {};
    const eventDateClause = eventDate
      ? { eventDate: new Date(String(eventDate)) }
      : {};

    const where: WhereOptions<HallBooking> = {
      ...searchClause,
      ...statusClause,
      ...paymentClause,
      ...eventDateClause
    };

    const { rows, count } = await HallBooking.findAndCountAll({
      where,
      include: [
        {
          model: Hall,
          attributes: ['id', 'name', 'hallCode']
        },
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
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: rows,
      pagination: {
        currentPage,
        pageSize,
        totalItems: count,
        totalPages: Math.ceil(count / pageSize)
      }
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_BOOKINGS_ERROR });
  }
};
