import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';

import { StaffDuty, Staff } from 'db';
import { sendMail } from 'utils/mailer';
import { WhereOptions } from 'sequelize';

import {
  ADD_STAFF_DUTY_ERROR,
  ADD_STAFF_DUTY_UNAUTHORIZED,
  GET_STAFF_DUTY_ERROR,
  UPDATE_STAFF_DUTY_ERROR,
  DELETE_STAFF_DUTY_ERROR
} from './duty.const';

/**
 * Types
 */
interface AddStaffDutyBody {
  staffId: string;
  dutyType: string;
  dutyDate: string;
  timeSlot: string;
  location?: string;
  dutyStatus?: string;
  notes?: string;
}

interface GetStaffDutiesQuery {
  page?: string;
  limit?: string;
  dutyStatus?: string;
  dutyType?: string;
  date?: string;
}

type DutyWhere = WhereOptions;

/**
 * CREATE
 */
export const addStaffDutyHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_STAFF_DUTY_UNAUTHORIZED });
    return;
  }

  const body = req.body as AddStaffDutyBody;
  const { staffId, dutyType, dutyDate, timeSlot, location } = body;

  try {
    const staff = await Staff.findByPk(staffId);

    if (!staff) {
      res.status(404).json({ message: 'Staff not found' });
      return;
    }

    const duty = await StaffDuty.create({
      ...body,
      dutyDate: new Date(dutyDate),
      createdBy: userId,
      updatedBy: userId
    });

    // 🔔 Send Email (non-blocking best practice)
    if (staff.email) {
      try {
        await sendMail({
          to: staff.email,
          subject: 'Duty Assigned - OMG Temple ERP',
          html: `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { padding: 20px 0; }
          .footer { color: #666; font-size: 12px; text-align: center; margin-top: 30px; }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="header">
            <h1>Duty Assigned Successfully</h1>
          </div>

          <div class="content">
            <p>Hello ${staff.fullName},</p>

            <p>
              A new duty has been successfully assigned to you.
            </p>

            <p><strong>Duty Details:</strong></p>

            <p>
              Duty Name: ${dutyType}
            </p>

            <p>
              Duty Date: ${dutyDate}
            </p>

            <p>
              Duty Time: ${timeSlot}
            </p>

            <p>
              Location: ${location}
            </p>

            <p>
              Please make sure to report on time and complete your assigned responsibilities.
            </p>

            <p>
              If you have any concerns regarding this duty assignment, please contact the administrator.
            </p>
          </div>

          <div class="footer">
            <p>&copy; 2026 OMG Temple ERP. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
        });
      } catch (mailError) {
        reportError(mailError); // don’t fail API
      }
    }

    res.status(201).json({
      message: 'Staff duty created successfully',
      id: duty.id
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: ADD_STAFF_DUTY_ERROR });
  }
};

/**
 * GET LIST
 */
export const getStaffDutiesHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_STAFF_DUTY_UNAUTHORIZED });
    return;
  }

  try {
    const {
      page = '1',
      limit = '10',
      dutyStatus,
      dutyType,
      date
    } = req.query as GetStaffDutiesQuery;

    const where: DutyWhere = {};

    if (dutyStatus) where['dutyStatus'] = dutyStatus;
    if (dutyType) where['dutyType'] = dutyType;

    if (date) {
      where['dutyDate'] = new Date(date);
    }

    const { rows, count } = await StaffDuty.findAndCountAll({
      where,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['dutyDate', 'DESC']]
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
    res.status(500).json({ message: GET_STAFF_DUTY_ERROR });
  }
};

/**
 * GET BY ID
 */
export const getStaffDutyHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_STAFF_DUTY_UNAUTHORIZED });
    return;
  }

  const { id } = req.params as { id: string };

  try {
    const duty = await StaffDuty.findOne({
      where: { id },
      include: [
        {
          model: Staff,
          attributes: ['id', 'fullName', 'email', 'staffRole']
        }
      ]
    });

    if (!duty) {
      res.status(404).json({ message: 'Staff duty not found' });
      return;
    }

    res.json(duty);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_STAFF_DUTY_ERROR });
  }
};

/**
 * UPDATE
 */
export const updateStaffDutyHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_STAFF_DUTY_UNAUTHORIZED });
    return;
  }

  const { id } = req.params as { id: string };

  try {
    const [updated] = await StaffDuty.update(
      {
        ...(req.body as Partial<AddStaffDutyBody>),
        updatedBy: userId
      },
      { where: { id } }
    );

    if (updated) {
      res.json({ message: 'Staff duty updated successfully' });
    } else {
      res.status(404).json({ message: 'Staff duty not found' });
    }
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: UPDATE_STAFF_DUTY_ERROR });
  }
};

/**
 * DELETE
 */
export const deleteStaffDutyHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: ADD_STAFF_DUTY_UNAUTHORIZED });
    return;
  }

  const { id } = req.params as { id: string };

  try {
    const deleted = await StaffDuty.destroy({ where: { id } });

    if (deleted) {
      res.json({ message: 'Staff duty deleted successfully' });
    } else {
      res.status(404).json({ message: 'Staff duty not found' });
    }
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_STAFF_DUTY_ERROR });
  }
};
