import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const dialect = (process.env.SQL_TYPE ?? 'postgres').toLowerCase();

  try {
    await queryInterface.createTable('user_permissions', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Permissions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
  } catch (error) {
    console.log('Table user_permissions might already exist, skipping creation.');
  }

  // Handle unique constraint/index - use a different name to avoid potential conflicts
  const constraintName = 'uq_user_permission_map';
  
  if (dialect === 'mysql') {
    try {
      await queryInterface.sequelize.query(`ALTER TABLE user_permissions DROP INDEX ${constraintName}`);
    } catch (e) { /* Ignore */ }
    try {
      await queryInterface.sequelize.query('ALTER TABLE user_permissions DROP INDEX unique_user_permission');
    } catch (e) { /* Ignore */ }
  } else {
    try {
      await queryInterface.removeConstraint('user_permissions', constraintName);
    } catch (e) { /* Ignore */ }
    try {
      await queryInterface.removeConstraint('user_permissions', 'unique_user_permission');
    } catch (e) { /* Ignore */ }
  }

  await queryInterface.addConstraint('user_permissions', {
    fields: ['userId', 'permissionId'],
    type: 'unique',
    name: constraintName
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('user_permissions');
}
