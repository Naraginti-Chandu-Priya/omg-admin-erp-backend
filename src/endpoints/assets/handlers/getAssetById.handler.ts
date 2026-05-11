import {
  EndpointAuthType,
  EndpointHandler,
  EndpointRequestType,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Asset } from 'db';
import { ASSETS_ERRORS } from '../assets.const';

export const getAssetByIdHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req: EndpointRequestType[EndpointAuthType.NONE], res: Response) => {
  try {
    const { id } = req.params as Record<string, string>;

    const asset = await Asset.findByPk(id);

    if (!asset) {
      res.status(404).json({ error: ASSETS_ERRORS.NOT_FOUND });
      return;
    }

    res.json({ data: asset });
  } catch (error) {
    reportError(error);
    res.status(500).json({ error: ASSETS_ERRORS.GET });
  }
};
