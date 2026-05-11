import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('Assets', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    assetCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    category: DataTypes.STRING,

    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    condition: {
      type: DataTypes.ENUM('Excellent', 'Good', 'Fair', 'Poor'),
      defaultValue: 'Good'
    },

    maintenanceStatus: {
      type: DataTypes.ENUM('Up to Date', 'Due Soon', 'Overdue'),
      defaultValue: 'Up to Date'
    },

    notes: DataTypes.TEXT,
    createdBy: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' }
    },

    updatedBy: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' }
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('Assets');
}
