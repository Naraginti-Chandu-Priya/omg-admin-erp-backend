import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';

import { Op, WhereOptions } from 'sequelize';
import { Volunteer } from 'db';

import {
  ADD_VOLUNTEER_ERROR,
  ADD_VOLUNTEER_UNAUTHORIZED,
  GET_VOLUNTEER_ERROR,
  UPDATE_VOLUNTEER_ERROR,
  DELETE_VOLUNTEER_ERROR
} from './volunteer.const';

/**
 * Types
 */
interface AddVolunteerBody {
  fullName: string;
  phoneNumber?: string;
  email?: string;
  preferredArea?: string;
  availability:
    | 'Morning (06:00 - 12:00)'
    | 'Evening (16:00 - 21:00)'
    | 'Full Day'
    | 'Weekends Only';
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Master / Lead';
  currentStatus?:
    | 'Registered'
    | 'Active'
    | 'Assigned (On Duty)'
    | 'On Leave'
    | 'Inactive';
  skills?: string[];
}

interface GetVolunteerQuery {
  page?: string;
  limit?: string;
  status?: string;
  name?: string;
}

export const addVolunteerHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_VOLUNTEER_UNAUTHORIZED });
    return;
  }

  const body = req.body as AddVolunteerBody;

  try {
    const volunteer = await Volunteer.create({
      ...body,
      createdBy: userId,
      updatedBy: userId
    });

    res.status(201).json({
      message: 'Volunteer registered successfully',
      id: volunteer.id
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: ADD_VOLUNTEER_ERROR });
  }
};

/**
 * GET LIST
 */
export const getVolunteersHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_VOLUNTEER_UNAUTHORIZED });
    return;
  }

  try {
    const {
      page = '1',
      limit = '10',
      status,
      name
    } = req.query as GetVolunteerQuery;

    const where: WhereOptions<Volunteer> = {};

    if (status) where.currentStatus = status;

    if (name) {
      where.fullName = {
        [Op.iLike]: `%${name}%`
      };
    }

    const { rows, count } = await Volunteer.findAndCountAll({
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
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_VOLUNTEER_ERROR });
  }
};

/**
 * GET BY ID
 */
export const getVolunteerHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_VOLUNTEER_UNAUTHORIZED });
    return;
  }

  const { id } = req.params as { id: string };

  try {
    const volunteer = await Volunteer.findByPk(id);

    if (!volunteer) {
      res.status(404).json({ message: 'Volunteer not found' });
      return;
    }

    res.json(volunteer);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_VOLUNTEER_ERROR });
  }
};

/**
 * UPDATE
 */
export const updateVolunteerHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_VOLUNTEER_UNAUTHORIZED });
    return;
  }

  const { id } = req.params as { id: string };

  try {
    const [updated] = await Volunteer.update(
      {
        ...(req.body as Partial<AddVolunteerBody>),
        updatedBy: userId
      },
      { where: { id } }
    );

    if (updated) {
      res.json({ message: 'Volunteer updated successfully' });
    } else {
      res.status(404).json({ message: 'Volunteer not found' });
    }
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: UPDATE_VOLUNTEER_ERROR });
  }
};

/**
 * DELETE
 */
export const deleteVolunteerHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_VOLUNTEER_UNAUTHORIZED });
    return;
  }

  const { id } = req.params as { id: string };

  try {
    const deleted = await Volunteer.destroy({ where: { id } });

    if (deleted) {
      res.json({ message: 'Volunteer deleted successfully' });
    } else {
      res.status(404).json({ message: 'Volunteer not found' });
    }
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_VOLUNTEER_ERROR });
  }
};
