import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';

import { Response } from 'express';
import { HallBooking } from 'db';
import { REVENUE_ERRORS } from '../revenue.const';

export const getRevenueTrendHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res: Response) => {
  try {
    const { months = 12 } = req.body as Record<string, unknown>;
    const limit = Math.min(parseInt(String(months), 10) || 12, 24);

    const trendRaw =
      ((await HallBooking.sequelize?.query(
        `
      SELECT 
        DATE_FORMAT(eventDate, '%Y-%m') as monthKey,
        DATE_FORMAT(eventDate, '%b') as name,
        SUM(totalAmount) as amount
      FROM HallBookings
      GROUP BY DATE_FORMAT(eventDate, '%Y-%m'), DATE_FORMAT(eventDate, '%b')
      ORDER BY monthKey ASC
      LIMIT ?
    `,
        {
          replacements: [limit],
          type: (
            HallBooking.sequelize as unknown as {
              QueryTypes: { SELECT: string };
            }
          ).QueryTypes.SELECT
        }
      )) as unknown as Array<{
        monthKey: string;
        name: string;
        amount: string;
      }>) || [];

    const trend = trendRaw.slice(-limit);

    const formattedTrend = trend.map((item) => ({
      name: item.name,
      amount: Number(item.amount || 0)
    }));

    res.json(formattedTrend);
  } catch (error) {
    reportError(error);
    res.status(500).json({ error: REVENUE_ERRORS.TREND });
  }
};
