import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('Staffs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    staffRole: {
      type: DataTypes.ENUM('Priest', 'Support Staff'),
      allowNull: false
    },

    department: DataTypes.STRING,

    joiningDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    salary: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },

    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active'
    },

    phoneNumber: DataTypes.STRING,

    email: DataTypes.STRING,

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
  await queryInterface.dropTable('Staffs');
}
