import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('StaffDuties', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    staffId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Staffs', key: 'id' }
    },

    dutyType: {
      type: DataTypes.ENUM(
        'Pooja Ritual',
        'Annadanam Service',
        'Temple Operations',
        'Administration',
        'Volunteer Coordination',
        'Maintenance'
      ),
      allowNull: false
    },

    dutyDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    timeSlot: {
      type: DataTypes.STRING,
      allowNull: false
    },

    location: DataTypes.STRING,

    dutyStatus: {
      type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
      defaultValue: 'Scheduled'
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
  await queryInterface.dropTable('StaffDuties');
}
