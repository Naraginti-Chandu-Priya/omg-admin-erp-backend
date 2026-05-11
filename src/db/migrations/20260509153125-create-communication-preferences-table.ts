import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const dialect = (process.env.SQL_TYPE ?? 'postgres').toLowerCase();

  await queryInterface.createTable('CommunicationPreferences', {
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

    smsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    emailEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    whatsappEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    preferredLanguage: {
      type: DataTypes.ENUM('Tamil', 'English', 'Hindi'),
      allowNull: true
    },

    unsubscribedAll: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  if (dialect === 'mysql') {
    await queryInterface.sequelize.query(`
      ALTER TABLE CommunicationPreferences
      MODIFY createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      MODIFY updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL;
    `);
  } else if (dialect === 'postgres') {
    await queryInterface.sequelize.query(`
      ALTER TABLE "CommunicationPreferences"
      ALTER COLUMN "createdAt" SET DEFAULT NOW(),
      ALTER COLUMN "updatedAt" SET DEFAULT NOW();
    `);
  } else if (dialect === 'mssql') {
    await queryInterface.sequelize.query(`
      ALTER TABLE CommunicationPreferences
      ADD CONSTRAINT DF_CommPref_createdAt DEFAULT GETDATE() FOR createdAt;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE CommunicationPreferences
      ADD CONSTRAINT DF_CommPref_updatedAt DEFAULT GETDATE() FOR updatedAt;
    `);
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('CommunicationPreferences');
}
