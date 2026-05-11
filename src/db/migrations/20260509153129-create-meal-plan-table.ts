import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('MealPlan', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    serviceDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    serviceType: {
      type: DataTypes.ENUM('BREAKFAST', 'LUNCH', 'DINNER'),
      allowNull: false
    },
    expectedCrowdCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currentStatus: {
      type: DataTypes.ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      allowNull: false
    },
    organizer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    foodItems: {
      type: DataTypes.JSON,
      allowNull: false
    },
    operationalNotes: {
      type: DataTypes.STRING,
      allowNull: true
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
  await queryInterface.dropTable('mealPlans');
}
