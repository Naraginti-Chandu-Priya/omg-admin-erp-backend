import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Hall } from 'db';
import { nanoid } from 'nanoid';
import { ADD_HALL_ERROR } from '../halls.const';

export const addHallHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req: EndpointRequestType[EndpointAuthType.NONE],
  res: Response
) => {
  const authenticatedUserId = req.user?.id;

  try {
    const hallCode = `HALL-${nanoid(5).toUpperCase()}`;

    const hall = await Hall.create({
      ...req.body,
      hallCode,
      amenities: JSON.stringify(req.body.amenities || []),
      images: JSON.stringify(req.body.images || []),
      createdBy: authenticatedUserId,
      updatedBy: authenticatedUserId
    });

    res.status(201).json(hall);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: ADD_HALL_ERROR });
  }
};
