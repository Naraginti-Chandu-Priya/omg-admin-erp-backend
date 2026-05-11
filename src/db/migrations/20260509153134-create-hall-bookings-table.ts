import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('HallBookings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    bookingCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    hallId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Halls', key: 'id' }
    },

    devoteeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Devotees', key: 'id' }
    },

    bookerName: DataTypes.STRING,
    bookerPhone: DataTypes.STRING,
    bookerEmail: DataTypes.STRING,

    eventDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    slot: {
      type: DataTypes.ENUM(
        'full_day',
        'half_day_morning',
        'half_day_evening',
        'custom'
      ),
      allowNull: false
    },

    eventCategory: DataTypes.STRING,
    guestCount: DataTypes.INTEGER,
    specialRequirements: DataTypes.TEXT,

    addons: {
      type: DataTypes.TEXT,
      defaultValue: '[]'
    },

    addonsAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },

    baseAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    festivalCharge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    advanceAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },

    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },

    balanceDue: DataTypes.DECIMAL(10, 2),

    paymentStatus: {
      type: DataTypes.ENUM('pending', 'partial', 'paid'),
      defaultValue: 'pending'
    },

    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending'
    },

    notes: DataTypes.TEXT,
    cancellationReason: DataTypes.TEXT,

    bookedBy: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' }
    },

    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('HallBookings');
}
