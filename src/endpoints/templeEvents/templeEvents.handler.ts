import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Op } from 'sequelize';

import { TempleEvent } from 'db';

import {
  ADD_TEMPLE_EVENT_ERROR,
  ADD_TEMPLE_EVENT_UNAUTHORIZED,
  GET_TEMPLE_EVENT_ERROR,
  UPDATE_TEMPLE_EVENT_ERROR,
  DELETE_TEMPLE_EVENT_ERROR
} from './templeEvents.const';
import { nanoid } from 'nanoid';

export const addTempleEventHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_TEMPLE_EVENT_UNAUTHORIZED });
    return;
  }

  const data = req.body;

  try {
    const eventCode = `EVT-${nanoid(6).toUpperCase()}`;

    const templeEvent = await TempleEvent.create({
      ...data,
      eventCode,
      createdBy: authenticatedUserId,
      updatedBy: authenticatedUserId
    });

    res.status(201).json({
      message: 'Temple event recorded successfully',
      id: templeEvent.id,
      eventCode: templeEvent.eventCode
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({
      message: ADD_TEMPLE_EVENT_ERROR
    });
  }
};

export const getTempleEventsHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_TEMPLE_EVENT_UNAUTHORIZED });
    return;
  }

  try {
    const {
      page = '1',
      limit = '100',
      status,
      festivalName,
      startDate,
      endDate
    } = req.query as {
      page?: string;
      limit?: string;
      status?: string;
      festivalName?: string;
      startDate?: string;
      endDate?: string;
    };

    const where: {
      isDeleted: boolean;
      status?: string;
      festivalName?: { [Op.iLike]: string };
      date?: { [Op.between]: [Date, Date] };
    } = { isDeleted: false };

    if (status) {
      where.status = status;
    }

    if (festivalName) {
      where.festivalName = { [Op.iLike]: `%${festivalName}%` };
    }

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const { rows, count } = await TempleEvent.findAndCountAll({
      where,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['date', 'ASC']]
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_TEMPLE_EVENT_ERROR });
  }
};

export const getTempleEventHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_TEMPLE_EVENT_UNAUTHORIZED });
    return;
  }

  const { id } = req.params;

  try {
    const templeEvent = await TempleEvent.findOne({
      where: { id, isDeleted: false }
    });

    if (!templeEvent) {
      res.status(404).json({ message: 'Temple event not found' });
      return;
    }

    res.json(templeEvent);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_TEMPLE_EVENT_ERROR });
  }
};

export const updateTempleEventHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_TEMPLE_EVENT_UNAUTHORIZED });
    return;
  }

  const { id } = req.params;
  const data = req.body;

  try {
    const [updated] = await TempleEvent.update(
      {
        ...data,
        updatedBy: authenticatedUserId
      },
      { where: { id } }
    );

    if (updated) {
      res.json({ message: 'Temple event updated successfully' });
    } else {
      res.status(404).json({ message: 'Temple event not found' });
    }
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: UPDATE_TEMPLE_EVENT_ERROR });
  }
};

export const deleteTempleEventHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_TEMPLE_EVENT_UNAUTHORIZED });
    return;
  }

  const { id } = req.params;

  try {
    const deleted = await TempleEvent.destroy({
      where: { id }
    });

    if (deleted) {
      res.json({ message: 'Temple event deleted successfully' });
    } else {
      res.status(404).json({ message: 'Temple event not found' });
    }
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_TEMPLE_EVENT_ERROR });
  }
};

export const getEventsByMonthHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const { month, year } = req.body as {
      month?: string;
      year?: string;
    };

    const m = parseInt(month || '');
    const y = parseInt(year || '');

    if (!m || !y) {
      res.status(400).json({
        message: 'month and year are required'
      });
      return;
    }

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 1);

    const events = await TempleEvent.findAll({
      where: {
        isDeleted: false,
        date: {
          [Op.gte]: startDate,
          [Op.lt]: endDate
        }
      },
      order: [['date', 'ASC']]
    });

    res.json({
      month: m,
      year: y,
      count: events.length,
      data: events
    });
    return;
  } catch (error) {
    reportError(error);
    res.status(500).json({
      message: 'Error fetching events'
    });
    return;
  }
};
