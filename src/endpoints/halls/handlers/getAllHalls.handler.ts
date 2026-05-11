import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Hall } from 'db';
import { GET_ALL_HALLS_ERROR } from '../halls.const';

export const getAllHallsHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (_req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const halls = await Hall.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(halls);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_ALL_HALLS_ERROR });
  }
};
