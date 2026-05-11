import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('PoojaSevas', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    sevaCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },

    devoteeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Devotees', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },

    sevaName: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    sevaAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    sevaDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    firstName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    gothram: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    nakshatra: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    rasi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Scheduled'
    },

    paymentStatus: {
      type: DataTypes.ENUM('Pending', 'Paid', 'Refunded'),
      allowNull: false,
      defaultValue: 'Pending'
    },

    receiptNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    registeredBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' }
    },

    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' }
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('PoojaSevas');
}
