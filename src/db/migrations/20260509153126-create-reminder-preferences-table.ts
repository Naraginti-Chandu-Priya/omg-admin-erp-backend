import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const dialect = (process.env.SQL_TYPE ?? 'postgres').toLowerCase();

  await queryInterface.createTable('ReminderPreferences', {
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

    birthdayReminder: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    nakshatraAnniversary: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    festivalGreetings: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    donationAnniversary: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  if (dialect === 'mysql') {
    await queryInterface.sequelize.query(`
      ALTER TABLE ReminderPreferences
      MODIFY createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      MODIFY updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL;
    `);
  } else if (dialect === 'postgres') {
    await queryInterface.sequelize.query(`
      ALTER TABLE "ReminderPreferences"
      ALTER COLUMN "createdAt" SET DEFAULT NOW(),
      ALTER COLUMN "updatedAt" SET DEFAULT NOW();
    `);
  } else if (dialect === 'mssql') {
    await queryInterface.sequelize.query(`
      ALTER TABLE ReminderPreferences
      ADD CONSTRAINT DF_RemPref_createdAt DEFAULT GETDATE() FOR createdAt;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE ReminderPreferences
      ADD CONSTRAINT DF_RemPref_updatedAt DEFAULT GETDATE() FOR updatedAt;
    `);
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('ReminderPreferences');
}
