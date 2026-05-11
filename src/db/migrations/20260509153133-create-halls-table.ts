import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('Halls', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    hallCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: DataTypes.TEXT,

    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    pricingStrategy: {
      type: DataTypes.ENUM('hourly', 'daily', 'tiered'),
      allowNull: false
    },

    ratePerHour: DataTypes.DECIMAL(10, 2),
    ratePerDay: DataTypes.DECIMAL(10, 2),

    depositAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },

    amenities: {
      type: DataTypes.TEXT,
      defaultValue: '[]'
    },

    images: {
      type: DataTypes.TEXT,
      defaultValue: '[]'
    },

    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    createdBy: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' }
    },

    updatedBy: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' }
    },

    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('Halls');
}
