import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('Donations', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    devoteeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Devotees', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },

    donationCode: {
      type: DataTypes.STRING(20),
      unique: true
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },

    category: {
      type: DataTypes.ENUM(
        'General',
        'Annadanam',
        'Renovation',
        'Festival',
        'Education',
        'Medical'
      )
    },

    donationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    channel: {
      type: DataTypes.ENUM('Hundi', 'Online', 'Counter')
    },

    paymentMethod: {
      type: DataTypes.ENUM('Cash', 'UPI', 'Card')
    },

    transactionRef: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    paymentStatus: {
      type: DataTypes.ENUM('Success', 'Pending', 'Failed')
    },

    receiptNumber: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    notes: DataTypes.TEXT,

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },

    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },

    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('Donations');
}
