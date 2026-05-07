import {
  EndpointAuthType,
  EndpointRequestType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Temple, User } from 'db';

// POST /temples - Create temple only
export const createTempleHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  const { name, code, email, phone, address, city, state, country, logo } = req.body;
  const user = req.user;

  try {
    const temple = await Temple.create({
      name, code, email, phone, address, city, state, country, logo,
      status: 'active',
      createdBy: user?.id
    });

    res.status(201).json({ message: 'Temple created successfully', temple });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Error creating temple', error });
  }
};

// GET /temples - Get all temples
export const getAllTemplesHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  _req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  try {
    const temples = await Temple.findAll();
    res.status(200).json({ temples });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Error fetching temples', error });
  }
};

// GET /temples/:id - Get temple by ID with its users
export const getTempleByIdHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  const { id } = req.params;
  try {
    const temple = await Temple.findByPk(id, { include: [User] });
    if (!temple) {
      res.status(404).json({ message: 'Temple not found' });
      return;
    }
    res.status(200).json({ temple });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Error fetching temple', error });
  }
};

// PUT /temples/:id - Update temple
export const updateTempleHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const temple = await Temple.findByPk(id);
    if (!temple) {
      res.status(404).json({ message: 'Temple not found' });
      return;
    }
    await temple.update(updates);
    res.status(200).json({ message: 'Temple updated', temple });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Error updating temple', error });
  }
};

// PATCH /temples/:id/status - Update temple status
export const updateTempleStatusHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const temple = await Temple.findByPk(id);
    if (!temple) {
      res.status(404).json({ message: 'Temple not found' });
      return;
    }
    temple.status = status;
    await temple.save();
    res.status(200).json({ message: 'Temple status updated', temple });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Error updating temple status', error });
  }
};

// DELETE /temples/:id - Delete temple
export const deleteTempleHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
) => {
  const { id } = req.params;
  try {
    const temple = await Temple.findByPk(id);
    if (!temple) {
      res.status(404).json({ message: 'Temple not found' });
      return;
    }
    await temple.destroy();
    res.status(200).json({ message: 'Temple deleted successfully' });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Error deleting temple', error });
  }
};
