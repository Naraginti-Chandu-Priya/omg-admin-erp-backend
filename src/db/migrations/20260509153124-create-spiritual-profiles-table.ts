import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('SpiritualProfiles', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    devoteeId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'Devotees', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    nakshatra: DataTypes.STRING(50),
    rasi: DataTypes.STRING(50),
    gothram: DataTypes.STRING(100),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('SpiritualProfiles');
}
