import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('TempleEvents', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    eventCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },

    eventName: {
      type: DataTypes.STRING(200),
      allowNull: false
    },

    festivalName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    time: {
      type: DataTypes.STRING(10),
      allowNull: false
    },

    organizerName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM('Planned', 'Scheduled', 'In Progress', 'Completed'),
      allowNull: false,
      defaultValue: 'Planned'
    },

    expectedDevotees: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    poojaType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    prasadamPlanned: {
      type: DataTypes.STRING(200),
      allowNull: true
    },

    resourceNeeded: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    isRecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    createdBy: {
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
  await queryInterface.dropTable('TempleEvents');
}
