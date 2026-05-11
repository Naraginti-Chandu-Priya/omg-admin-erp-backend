import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';

import { Response } from 'express';
import { fn, col, Op } from 'sequelize';
import { HallBooking, Hall } from 'db';
import { REVENUE_ERRORS } from '../revenue.const';

export const getRevenueSummaryHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (_req, res: Response) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 1);

    const prevStart = new Date(currentYear, currentMonth - 1, 1);
    const prevEnd = new Date(currentYear, currentMonth, 1);

    const confirmedBookings = await HallBooking.count({
      where: { status: 'confirmed' }
    });

    const activeHalls = await Hall.count({
      where: { isAvailable: true }
    });

    const maxBookings = await HallBooking.count({
      where: {
        eventDate: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    const totalRevenue = Number((await HallBooking.sum('totalAmount')) || 0);

    const currentMonthRevenue = Number(
      (await HallBooking.sum('totalAmount', {
        where: {
          eventDate: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        }
      })) || 0
    );

    const prevMonthRevenue = Number(
      (await HallBooking.sum('totalAmount', {
        where: {
          eventDate: {
            [Op.between]: [prevStart, prevEnd]
          }
        }
      })) || 0
    );

    const growth =
      prevMonthRevenue > 0
        ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
        : currentMonthRevenue > 0
          ? 100
          : 0;

    const avgResult = (await HallBooking.findOne({
      attributes: [[fn('AVG', col('totalAmount')), 'avgBooking']],
      raw: true
    })) as unknown as { avgBooking: string };

    const avgPerBooking = Number(avgResult?.avgBooking || 0);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const peakOccupancy = Math.min(
      100,
      Math.round((maxBookings / daysInMonth) * 100)
    );

    const avgUtilization = activeHalls
      ? Math.min(
          100,
          Math.round((confirmedBookings / (activeHalls * daysInMonth)) * 100)
        )
      : 0;

    res.json({
      totalRevenue,
      currentMonthRevenue,
      avgPerBooking,
      peakOccupancy,
      confirmedBookings,
      activeHalls,
      avgUtilization,
      growth: Math.round(growth * 100) / 100
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ error: REVENUE_ERRORS.SUMMARY });
  }
};
