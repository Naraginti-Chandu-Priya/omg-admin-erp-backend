import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Asset } from 'db';
import { ASSETS_ERRORS } from '../assets.const';

export const getAllAssetsHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (_req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const assets = await Asset.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: assets,
      meta: {
        total: assets.length
      }
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ error: ASSETS_ERRORS.LIST });
  }
};
