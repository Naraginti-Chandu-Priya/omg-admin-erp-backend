import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const dialect = (process.env.SQL_TYPE ?? 'postgres').toLowerCase();

  await queryInterface.createTable('FamilyMembers', {
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

    linkedDevoteeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'Devotees', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },

    relation: {
      type: DataTypes.ENUM(
        'Spouse',
        'Son',
        'Daughter',
        'Father',
        'Mother',
        'Brother',
        'Sister',
        'Other'
      ),
      allowNull: false
    },

    memberName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },

    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },

    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: true
    },

    isRegistered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    parentMemberId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'FamilyMembers', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },

    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  });

  if (dialect === 'mysql') {
    await queryInterface.sequelize.query(`
      ALTER TABLE FamilyMembers
      MODIFY createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      MODIFY updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL;
    `);
  } else if (dialect === 'postgres') {
    await queryInterface.sequelize.query(`
      ALTER TABLE "FamilyMembers"
      ALTER COLUMN "createdAt" SET DEFAULT NOW(),
      ALTER COLUMN "updatedAt" SET DEFAULT NOW();
    `);
  } else if (dialect === 'mssql') {
    await queryInterface.sequelize.query(`
      ALTER TABLE FamilyMembers
      ADD CONSTRAINT DF_Family_createdAt DEFAULT GETDATE() FOR createdAt;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE FamilyMembers
      ADD CONSTRAINT DF_Family_updatedAt DEFAULT GETDATE() FOR updatedAt;
    `);
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('FamilyMembers');
}
