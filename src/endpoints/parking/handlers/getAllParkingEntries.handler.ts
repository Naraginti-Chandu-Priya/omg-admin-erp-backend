import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { ParkingEntry, ParkingZone } from 'db';
import { GET_ALL_PARKING_ENTRIES_ERROR } from '../parking.const';

export const getAllParkingEntriesHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (_req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const entries = await ParkingEntry.findAll({
      include: [ParkingZone]
    });
    res.status(200).json(entries);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_ALL_PARKING_ENTRIES_ERROR });
  }
};
