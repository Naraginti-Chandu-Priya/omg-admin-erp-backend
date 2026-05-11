import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'create-password',
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        hash: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        exp: {
          type: DataTypes.DATE,
          allowNull: false
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
      },
      { transaction }
    );

    try {
      await queryInterface.addIndex('create-password', ['userId'], {
        name: 'create_password_user_id_index',
        transaction
      });
    } catch {
      // Silently ignore if index already exists
    }

    try {
      await queryInterface.addIndex('create-password', ['exp'], {
        name: 'create_password_exp_index',
        transaction
      });
    } catch {
      // Silently ignore if index already exists
    }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('create-password', { transaction });
  });
}
