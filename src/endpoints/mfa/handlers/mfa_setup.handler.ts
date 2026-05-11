import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { User } from 'db';
import {
  EndpointAuthType,
  EndpointHandler,
  reportError,
  sequelize
} from 'node-server-engine';
import {
  MFA_UNAUTHORIZED,
  MFA_USER_NOT_FOUND,
  MFA_INTERNAL_ERROR
} from '../mfa.const';

export const mfaSetupHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req,
  res
) => {
  const authenticatedUserId = req.user?.id;

  if (!authenticatedUserId) {
    res.status(401).json({ error: MFA_UNAUTHORIZED });
    return;
  }

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(authenticatedUserId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!user) {
      await transaction.rollback();
      res.status(404).json({ error: MFA_USER_NOT_FOUND });
      return;
    }

    const secret = speakeasy.generateSecret({ length: 20 });

    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `omg_erp:${user.email}`,
      issuer: 'OMG-ERP',
      encoding: 'base32'
    });

    await user.update(
      {
        mfaCode: secret.base32,
        mfaFailedCount: 0,
        mfaAccountLockedUntil: null
      },
      { transaction }
    );

    const qrCode = await QRCode.toDataURL(otpauthUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300
    });

    await transaction.commit();

    res.status(200).json({ qrCode });
    return;
  } catch (error) {
    await transaction.rollback();
    reportError(error);
    res.status(500).json({ error: MFA_INTERNAL_ERROR });
    return;
  }
};
