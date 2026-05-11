import {
  EndpointHandler,
  EndpointAuthType,
  reportError
} from 'node-server-engine';
import { Procurement } from 'db';
import {
  ADD_PROCUREMENT_ERROR,
  GET_PROCUREMENTS_ERROR,
  GET_PROCUREMENT_ERROR,
  UPDATE_PROCUREMENT_ERROR,
  DELETE_PROCUREMENT_ERROR
} from './procurement.const';
import { nanoid } from 'nanoid';

type ProcurementBody = {
  poNumber: string;
  vendor: string;
  amount: number;
  date: string;
  status?: string;
  items: object[];
  notes?: string;
  deliveryDate?: string;
  paymentTerms?: string;
  rejectionReason?: string;
  submittedBy?: string;
  submittedByName?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectedDate?: string;
};

export const addProcurementHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const data = req.body as ProcurementBody;

    const poNumber = `PO-${nanoid(6).toUpperCase()}`;

    const procurement = await Procurement.create({
      ...data,
      poNumber
    });

    res.status(201).json(procurement);
  } catch (error) {
    reportError(error);
    const message =
      error instanceof Error ? error.message : ADD_PROCUREMENT_ERROR;
    res.status(500).json({ message });
  }
};

export const getProcurementsHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const { page = '1', limit = '10' } = req.query as {
      page?: string;
      limit?: string;
    };

    const { rows, count } = await Procurement.findAndCountAll({
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
    res.status(500).json({ message: GET_PROCUREMENTS_ERROR });
  }
};

export const getProcurementHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const procurement = await Procurement.findByPk(req.params.id as string);
    if (!procurement) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(procurement);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_PROCUREMENT_ERROR });
  }
};

export const updateProcurementHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    await Procurement.update(req.body as Partial<ProcurementBody>, {
      where: { id: req.params.id as string }
    });
    const procurement = await Procurement.findByPk(req.params.id as string);
    res.json(procurement);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: UPDATE_PROCUREMENT_ERROR });
  }
};

export const deleteProcurementHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    await Procurement.destroy({ where: { id: req.params.id as string } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_PROCUREMENT_ERROR });
  }
};
