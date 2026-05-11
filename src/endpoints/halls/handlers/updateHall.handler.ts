import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Hall } from 'db';
import { HALL_NOT_FOUND, UPDATE_HALL_ERROR } from '../halls.const';

export const updateHallHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req: EndpointRequestType[EndpointAuthType.NONE],
  res: Response
) => {
  try {
    const { id } = req.params;

    const hall = await Hall.findByPk(id);

    if (!hall) {
      res.status(404).json({ message: HALL_NOT_FOUND });
      return;
    }

    await hall.update({
      ...req.body,
      amenities: req.body.amenities
        ? JSON.stringify(req.body.amenities)
        : hall.amenities,
      images: req.body.images ? JSON.stringify(req.body.images) : hall.images
    });

    res.json({
      message: 'Updated successfully',
      hall
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: UPDATE_HALL_ERROR });
  }
};
