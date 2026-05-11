import {
  EndpointHandler,
  EndpointAuthType,
  reportError
} from 'node-server-engine';
import { Distribution } from 'db';
import {
  ADD_DISTRIBUTION_ERROR,
  GET_DISTRIBUTIONS_ERROR,
  GET_DISTRIBUTION_ERROR,
  UPDATE_DISTRIBUTION_ERROR,
  DELETE_DISTRIBUTION_ERROR
} from './distribution.const';

type DistributionBody = {
  mealPlanId: string;
  actualServedCount: number;
  serviceStatus: string;
  startTime: string;
  endTime?: string;
  leadVolunteer?: string;
  leftoverRecord?: string;
  feedback?: string;
};

export const addDistributionHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const dist = await Distribution.create(req.body as DistributionBody);
    res.status(201).json(dist);
  } catch (error) {
    reportError(error);
    const message =
      error instanceof Error ? error.message : ADD_DISTRIBUTION_ERROR;
    res.status(500).json({ message });
  }
};

export const getDistributionsHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const { page = '1', limit = '10' } = req.query as {
      page?: string;
      limit?: string;
    };

    const { rows, count } = await Distribution.findAndCountAll({
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
    res.status(500).json({ message: GET_DISTRIBUTIONS_ERROR });
  }
};

export const getDistributionHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const dist = await Distribution.findByPk(req.params.id as string);
    if (!dist) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(dist);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_DISTRIBUTION_ERROR });
  }
};

export const updateDistributionHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    await Distribution.update(req.body as Partial<DistributionBody>, {
      where: { id: req.params.id as string }
    });
    const dist = await Distribution.findByPk(req.params.id as string);
    res.json(dist);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: UPDATE_DISTRIBUTION_ERROR });
  }
};

export const deleteDistributionHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    await Distribution.destroy({ where: { id: req.params.id as string } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_DISTRIBUTION_ERROR });
  }
};
