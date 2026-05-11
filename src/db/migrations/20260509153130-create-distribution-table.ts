import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('Distribution', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },

    mealPlanId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'MealPlan',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    actualServedCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    serviceStatus: {
      type: DataTypes.ENUM('Pending', 'Served', 'Partial', 'Cancelled'),
      allowNull: false
    },

    startTime: {
      type: DataTypes.STRING,
      allowNull: false
    },

    endTime: {
      type: DataTypes.STRING,
      allowNull: true
    },

    leadVolunteer: {
      type: DataTypes.STRING,
      allowNull: true
    },

    leftoverRecord: {
      type: DataTypes.STRING,
      allowNull: true
    },

    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
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
  await queryInterface.dropTable('Distribution');
}
