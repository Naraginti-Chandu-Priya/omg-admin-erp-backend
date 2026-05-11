import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('Volunteers', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    preferredArea: DataTypes.STRING,

    availability: {
      type: DataTypes.ENUM(
        'Morning (06:00 - 12:00)',
        'Evening (16:00 - 21:00)',
        'Full Day',
        'Weekends Only'
      ),
      allowNull: false
    },

    experienceLevel: {
      type: DataTypes.ENUM('Beginner', 'Intermediate', 'Master / Lead'),
      defaultValue: 'Beginner'
    },

    currentStatus: {
      type: DataTypes.ENUM(
        'Registered',
        'Active',
        'Assigned (On Duty)',
        'On Leave',
        'Inactive'
      ),
      defaultValue: 'Registered'
    },

    skills: DataTypes.JSON,

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
  await queryInterface.dropTable('Volunteers');
}
