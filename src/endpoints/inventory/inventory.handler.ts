import {
  EndpointHandler,
  EndpointAuthType,
  reportError
} from 'node-server-engine';
import { Inventory } from 'db';
import {
  ADD_INVENTORY_ERROR,
  GET_INVENTORIES_ERROR,
  GET_INVENTORY_ERROR,
  UPDATE_INVENTORY_ERROR,
  DELETE_INVENTORY_ERROR
} from './inventory.const';

type InventoryBody = {
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  supplierName?: string;
};

export const addInventoryHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const inventory = await Inventory.create(req.body as InventoryBody);
    res.status(201).json(inventory);
  } catch (error) {
    reportError(error);
    const message =
      error instanceof Error ? error.message : ADD_INVENTORY_ERROR;
    res.status(500).json({ message });
  }
};

export const getInventoriesHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const { page = '1', limit = '10' } = req.query as {
      page?: string;
      limit?: string;
    };

    const { rows, count } = await Inventory.findAndCountAll({
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
    res.status(500).json({ message: GET_INVENTORIES_ERROR });
  }
};

export const getInventoryHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id as string);
    if (!inventory) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(inventory);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_INVENTORY_ERROR });
  }
};

export const updateInventoryHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    await Inventory.update(req.body as Partial<InventoryBody>, {
      where: { id: req.params.id as string }
    });
    const inventory = await Inventory.findByPk(req.params.id as string);
    res.json(inventory);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: UPDATE_INVENTORY_ERROR });
  }
};

export const deleteInventoryHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    await Inventory.destroy({ where: { id: req.params.id as string } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_INVENTORY_ERROR });
  }
};
