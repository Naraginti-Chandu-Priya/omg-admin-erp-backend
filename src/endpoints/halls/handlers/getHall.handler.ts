import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Hall } from 'db';
import { HALL_NOT_FOUND, GET_HALL_ERROR } from '../halls.const';

export const getHallHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req: EndpointRequestType[EndpointAuthType.NONE],
  res: Response
) => {
  try {
    const hall = await Hall.findByPk(req.params.id);

    if (!hall) {
      res.status(404).json({ message: HALL_NOT_FOUND });
      return;
    }

    res.json(hall);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_HALL_ERROR });
  }
};
