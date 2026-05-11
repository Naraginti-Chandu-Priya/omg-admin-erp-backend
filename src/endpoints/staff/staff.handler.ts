import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';

import { Op, WhereOptions } from 'sequelize';
import { Staff } from 'db';

import {
  ADD_STAFF_ERROR,
  ADD_STAFF_UNAUTHORIZED,
  GET_STAFF_ERROR,
  UPDATE_STAFF_ERROR,
  DELETE_STAFF_ERROR
} from './staff.const';

/**
 * Types
 */
interface AddStaffBody {
  fullName: string;
  staffRole: 'Priest' | 'Support Staff';
  department?: string;
  joiningDate: string;
  salary?: number;
  status?: 'Active' | 'Inactive';
  phoneNumber?: string;
  email?: string;
}

interface GetStaffQuery {
  page?: string;
  limit?: string;
  status?: 'Active' | 'Inactive';
  staffRole?: 'Priest' | 'Support Staff';
  name?: string;
}

/**
 * CREATE
 */
export const addStaffHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req,
  res
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_STAFF_UNAUTHORIZED });
    return;
  }

  const body = req.body as AddStaffBody;

  try {
    const staff = await Staff.create({
      ...body,
      joiningDate: new Date(body.joiningDate),
      createdBy: userId,
      updatedBy: userId
    });

    res.status(201).json({
      message: 'Staff created successfully',
      id: staff.id
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: ADD_STAFF_ERROR });
  }
};

/**
 * GET LIST
 */
export const getStaffsHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req,
  res
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_STAFF_UNAUTHORIZED });
    return;
  }

  try {
    const {
      page = '1',
      limit = '10',
      status,
      staffRole,
      name
    } = req.query as GetStaffQuery;

    const where: WhereOptions<Staff> = {};

    if (status) where.status = status;
    if (staffRole) where.staffRole = staffRole;

    if (name) {
      where.fullName = {
        [Op.iLike]: `%${name}%`
      };
    }

    const { rows, count } = await Staff.findAndCountAll({
      where,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['createdAt', 'DESC']]
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
    res.status(500).json({ message: GET_STAFF_ERROR });
  }
};

/**
 * GET BY ID
 */
export const getStaffHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req,
  res
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_STAFF_UNAUTHORIZED });
    return;
  }

  const { id } = req.params as { id: string };

  try {
    const staff = await Staff.findByPk(id);

    if (!staff) {
      res.status(404).json({ message: 'Staff not found' });
      return;
    }

    res.json(staff);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_STAFF_ERROR });
  }
};

/**
 * UPDATE
 */
export const updateStaffHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_STAFF_UNAUTHORIZED });
    return;
  }

  const { id } = req.params as { id: string };

  try {
    const [updated] = await Staff.update(
      {
        ...(req.body as Partial<AddStaffBody>),
        updatedBy: userId
      },
      { where: { id } }
    );

    if (updated) {
      res.json({ message: 'Staff updated successfully' });
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: UPDATE_STAFF_ERROR });
  }
};

/**
 * DELETE
 */
export const deleteStaffHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_STAFF_UNAUTHORIZED });
    return;
  }

  const { id } = req.params as { id: string };

  try {
    const deleted = await Staff.destroy({ where: { id } });

    if (deleted) {
      res.json({ message: 'Staff deleted successfully' });
    } else {
      res.status(404).json({ message: 'Staff not found' });
    }
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_STAFF_ERROR });
  }
};
