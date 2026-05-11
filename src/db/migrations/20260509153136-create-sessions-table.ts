import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('Sessions', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
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

    tokenHash: {
      type: DataTypes.STRING,
      allowNull: false
    },

    expiry: {
      type: DataTypes.DATE,
      allowNull: false
    },

    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    },

    ipAddress: {
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

  try {
    await queryInterface.addIndex('Sessions', ['tokenHash'], {
      unique: true,
      name: 'sessions_token_hash_unique'
    });
  } catch {
    // Silently ignore if index already exists
  }

  try {
    await queryInterface.addIndex('Sessions', ['userId'], {
      name: 'sessions_user_id_index'
    });
  } catch {
    // Silently ignore if index already exists
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('Sessions');
}
