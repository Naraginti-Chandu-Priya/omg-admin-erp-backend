import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Op } from 'sequelize';

import { PoojaSeva, Devotee } from 'db';

import {
  ADD_POOJASEVA_ERROR,
  ADD_POOJASEVA_UNAUTHORIZED,
  GET_POOJASEVA_ERROR,
  UPDATE_POOJASEVA_ERROR,
  DELETE_POOJASEVA_ERROR
} from './poojasevas.const';
import { nanoid } from 'nanoid';

export const addPoojaSevaHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_POOJASEVA_UNAUTHORIZED });
    return;
  }

  const data = req.body;

  try {
    const sevaCode = `SEVA-${nanoid(6).toUpperCase()}`;

    const receiptNumber =
      data.receiptNumber || `REC-${nanoid(6).toUpperCase()}`;

    const poojaSeva = await PoojaSeva.create({
      ...data,
      sevaCode,
      receiptNumber,
      registeredBy: authenticatedUserId,
      updatedBy: authenticatedUserId
    });

    res.status(201).json({
      message: 'Pooja Seva recorded successfully',
      id: poojaSeva.id,
      sevaCode: poojaSeva.sevaCode
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({
      message: ADD_POOJASEVA_ERROR
    });
  }
};

export const getPoojaSevasHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_POOJASEVA_UNAUTHORIZED });
    return;
  }

  try {
    const {
      page = '1',
      limit = '100',
      date
    } = req.query as {
      page?: string;
      limit?: string;
      date?: string;
    };

    const where: {
      isDeleted: boolean;
      sevaDate?: { [Op.between]: [Date, Date] };
    } = { isDeleted: false };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.sevaDate = {
        [Op.between]: [startOfDay, endOfDay]
      };
    }

    const { rows, count } = await PoojaSeva.findAndCountAll({
      where,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['sevaDate', 'ASC']],
      include: [{ model: Devotee }]
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
    res.status(500).json({ message: GET_POOJASEVA_ERROR });
  }
};

export const getPoojaSevaHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;
  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_POOJASEVA_UNAUTHORIZED });
    return;
  }
  const { id } = req.params;

  try {
    const poojaSeva = await PoojaSeva.findOne({
      where: { id, isDeleted: false },
      include: [{ model: Devotee }]
    });

    if (!poojaSeva) {
      res.status(404).json({ message: 'Pooja Seva not found' });
      return;
    }

    res.json(poojaSeva);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_POOJASEVA_ERROR });
  }
};

export const updatePoojaSevaHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;
  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_POOJASEVA_UNAUTHORIZED });
    return;
  }
  const { id } = req.params;
  const data = req.body;

  if (!req.user?.id) {
    res.status(401).json({ message: ADD_POOJASEVA_UNAUTHORIZED });
    return;
  }

  try {
    const [updated] = await PoojaSeva.update(
      {
        ...data,
        updatedBy: authenticatedUserId
      },
      { where: { id } }
    );

    if (updated) {
      res.json({ message: 'Pooja Seva updated successfully' });
    } else {
      res.status(404).json({ message: 'Pooja Seva not found' });
    }
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: UPDATE_POOJASEVA_ERROR });
  }
};

export const deletePoojaSevaHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ message: ADD_POOJASEVA_UNAUTHORIZED });
    return;
  }

  const { id } = req.params;

  try {
    const deleted = await PoojaSeva.destroy({
      where: { id }
    });

    if (deleted) {
      res.json({ message: 'Pooja Seva deleted successfully' });
    } else {
      res.status(404).json({ message: 'Pooja Seva not found' });
    }
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_POOJASEVA_ERROR });
  }
};
