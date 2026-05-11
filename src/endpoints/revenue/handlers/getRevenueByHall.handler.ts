import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';

import { Response } from 'express';
import { fn, col } from 'sequelize';
import { HallBooking, Hall } from 'db';
import { REVENUE_ERRORS } from '../revenue.const';

export const getRevenueByHallHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (_req, res: Response) => {
  try {
    const data = await HallBooking.findAll({
      attributes: ['hallId', [fn('SUM', col('totalAmount')), 'revenue']],
      include: [
        {
          model: Hall,
          attributes: ['name'],
          as: 'hall'
        }
      ],
      group: ['hallId'],
      order: [[fn('SUM', col('totalAmount')), 'DESC']],
      raw: false
    });

    const totalRevenue = data.reduce(
      (sum, item) => sum + Number(item.getDataValue('revenue') || 0),
      0
    );

    const formatted = data.map((item) => {
      const revenue = Number(item.getDataValue('revenue') || 0);
      const hallName = item.hall?.name || 'Unknown';

      return {
        name: hallName,
        value: totalRevenue ? Math.round((revenue / totalRevenue) * 100) : 0
      };
    });

    res.json(formatted);
    return;
  } catch (error) {
    reportError(error);

    res.status(500).json({ error: REVENUE_ERRORS.BY_HALL });
    return;
  }
};
