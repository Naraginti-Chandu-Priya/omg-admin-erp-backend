import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';

import { Op, fn, col } from 'sequelize';
import { HallBooking, Hall } from 'db';
import { REVENUE_ERRORS } from '../revenue.const';

export const getRevenueLedgerHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body as Record<string, unknown>;

    const where: Record<string, unknown> = {};

    if (fromDate && toDate) {
      where.eventDate = {
        [Op.between]: [new Date(String(fromDate)), new Date(String(toDate))]
      };
    }

    const monthlyData = (await HallBooking.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('eventDate'), '%Y-%m'), 'month'],
        [fn('COUNT', col('id')), 'bookings'],
        [fn('SUM', col('totalAmount')), 'revenue']
      ],
      where,
      group: [fn('DATE_FORMAT', col('eventDate'), '%Y-%m')],
      order: [['month', 'DESC']],
      raw: true
    })) as unknown as Array<{
      month: string;
      bookings: string;
      revenue: string;
    }>;

    const result = await Promise.all(
      monthlyData.map(async (m) => {
        const monthStart = new Date(m.month + '-01');
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);

        const topHall = (await HallBooking.findAll({
          attributes: ['hallId', [fn('SUM', col('totalAmount')), 'revenue']],
          where: {
            ...where,
            eventDate: {
              [Op.between]: [monthStart, monthEnd]
            }
          },
          include: [{ model: Hall, attributes: ['name'] }],
          group: ['HallBooking.hallId'],
          order: [['revenue', 'DESC']],
          limit: 1,
          raw: true
        })) as unknown as Array<{ revenue: number; Hall: { name: string } }>;

        const totalRevenue = Number(m.revenue || 0);

        let hallName = '-';
        let percent = 0;

        if (topHall.length > 0) {
          const hallRevenue = Number(topHall[0].revenue || 0);
          hallName = topHall[0].Hall?.name || '-';
          percent = totalRevenue
            ? Math.round((hallRevenue / totalRevenue) * 100)
            : 0;
        }

        const efficiency = Math.min(
          100,
          Math.round((Number(m.bookings) / 30) * 100)
        );

        return {
          period: m.month,
          bookings: Number(m.bookings),
          revenue: totalRevenue,
          topHall: hallName,
          topHallPercent: percent,
          efficiency
        };
      })
    );

    res.json({
      data: result
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ error: REVENUE_ERRORS.LEDGER });
  }
};
