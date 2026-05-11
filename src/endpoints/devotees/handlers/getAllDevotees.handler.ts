import {
  EndpointAuthType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { WhereOptions, Op } from 'sequelize';
import {
  Devotee,
  SpiritualProfile,
  CommunicationPreference,
  ReminderPreference,
  FamilyMember,
  User,
  Donation,
  PoojaSeva
} from 'db';
import { parsePositiveInteger } from './utils';

export const getAllDevoteesHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status
    } = req.query as Record<string, unknown>;

    const currentPage = parsePositiveInteger(page, 1);
    const requestedLimit = parsePositiveInteger(limit, 10);
    const pageSize = Math.min(requestedLimit, 100);
    const offset = (currentPage - 1) * pageSize;
    const searchTerm = typeof search === 'string' ? search.trim() : '';

    const searchClause = searchTerm
      ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${searchTerm}%` } },
            { lastName: { [Op.like]: `%${searchTerm}%` } },
            { phone: { [Op.like]: `%${searchTerm}%` } },
            { email: { [Op.like]: `%${searchTerm}%` } },
            { devoteeCode: { [Op.like]: `%${searchTerm}%` } }
          ]
        }
      : {};

    const statusClause =
      status === 'Active' || status === 'Inactive' ? { status } : {};

    const where: WhereOptions<Devotee> = {
      isDeleted: false,
      ...searchClause,
      ...statusClause
    };

    const { rows, count } = await Devotee.findAndCountAll({
      where,
      distinct: true,
      include: [
        { model: SpiritualProfile },
        { model: CommunicationPreference },
        { model: ReminderPreference },
        { model: FamilyMember },
        { model: Donation },
        { model: PoojaSeva },
        {
          model: User,
          as: 'createdByUser',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        },
        {
          model: User,
          as: 'updatedByUser',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        }
      ],
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = count === 0 ? 0 : Math.ceil(count / pageSize);

    res.json({
      data: rows,
      meta: {
        total: count,
        page: currentPage,
        limit: pageSize,
        totalPages,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages
      }
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: 'Failed to fetch devotees' });
  }
};
