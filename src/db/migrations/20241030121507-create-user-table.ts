import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const dialect = (process.env.SQL_TYPE ?? 'postgres').toLowerCase();

  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'Users',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        dateOfBirth: {
          type: DataTypes.DATE,
          allowNull: true
        },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Roles', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        templeId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'Temples', key: 'id' },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        accountStatus: {
          type: DataTypes.ENUM('active', 'inactive', 'suspended'),
          allowNull: false,
          defaultValue: 'active'
        },
        isFirstLogin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        mfaCode: { type: DataTypes.STRING, allowNull: true },
        mfaFailedCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        mfaAccountLockedUntil: { type: DataTypes.DATE, allowNull: true },
        lastLogin: { type: DataTypes.DATE, allowNull: true },
        createdBy: { type: DataTypes.INTEGER, allowNull: true },
        updatedBy: { type: DataTypes.INTEGER, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false }
      },
      { transaction }
    );

    if (dialect === 'mysql') {
      await queryInterface.sequelize.query(
        `
          ALTER TABLE Users
          MODIFY createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          MODIFY updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL;
        `,
        { transaction }
      );
    } else if (dialect === 'postgres') {
      await queryInterface.sequelize.query(
        `
          ALTER TABLE "Users"
          ALTER COLUMN "createdAt" SET DEFAULT NOW(),
          ALTER COLUMN "updatedAt" SET DEFAULT NOW();
        `,
        { transaction }
      );
    } else if (dialect === 'mssql') {
      await queryInterface.sequelize.query(
        `
          ALTER TABLE Users
          ADD CONSTRAINT DF_Users_createdAt DEFAULT GETDATE() FOR createdAt;
        `,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `
          ALTER TABLE Users
          ADD CONSTRAINT DF_Users_updatedAt DEFAULT GETDATE() FOR updatedAt;
        `,
        { transaction }
      );
    } else {
      throw new Error('Unsupported SQL dialect');
    }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('Users', { transaction });
  });
}
