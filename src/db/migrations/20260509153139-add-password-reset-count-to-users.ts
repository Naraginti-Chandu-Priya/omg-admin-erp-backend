import { QueryInterface, DataTypes } from 'sequelize';

const hasColumn = (
  tableDescription: Record<string, unknown>,
  columnName: string
): boolean =>
  Object.prototype.hasOwnProperty.call(tableDescription, columnName);

export async function up(queryInterface: QueryInterface): Promise<void> {
  const usersTable = await queryInterface.describeTable('Users');

  if (hasColumn(usersTable, 'passwordResetCount')) {
    return;
  }

  await queryInterface.addColumn('Users', 'passwordResetCount', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  const usersTable = await queryInterface.describeTable('Users');

  if (!hasColumn(usersTable, 'passwordResetCount')) {
    return;
  }

  await queryInterface.removeColumn('Users', 'passwordResetCount');
}
