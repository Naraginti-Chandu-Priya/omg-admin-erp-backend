import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('Procurement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },

    poNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    vendor: {
      type: DataTypes.STRING,
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    date: {
      type: DataTypes.STRING,
      allowNull: false
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pending'
    },

    items: {
      type: DataTypes.JSON,
      allowNull: false
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    deliveryDate: {
      type: DataTypes.STRING,
      allowNull: true
    },

    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: true
    },

    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    submittedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },

    submittedByName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },

    approvedByName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    approvedDate: {
      type: DataTypes.STRING,
      allowNull: true
    },

    rejectedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },

    rejectedByName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    rejectedDate: {
      type: DataTypes.STRING,
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
  await queryInterface.dropTable('Procurement');
}
