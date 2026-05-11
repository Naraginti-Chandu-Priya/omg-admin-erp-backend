import { QueryInterface, QueryTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const timestamp = new Date();
  const dialect = (process.env.SQL_TYPE ?? 'postgres').toLowerCase();
  
  const rolesTable = dialect === 'postgres' ? '"Roles"' : 'Roles';
  const usersTable = dialect === 'postgres' ? '"Users"' : 'Users';
  const permissionsTable = dialect === 'postgres' ? '"Permissions"' : 'Permissions';

  const roles = (await queryInterface.sequelize.query(
    `SELECT id FROM ${rolesTable} WHERE name = 'superadmin'`,
    { type: QueryTypes.SELECT }
  )) as { id: number }[];

  if (roles.length === 0) return;

  const users = (await queryInterface.sequelize.query(
    `SELECT id FROM ${usersTable} WHERE ${dialect === 'postgres' ? '"roleId"' : 'roleId'} = ${roles[0].id}`,
    { type: QueryTypes.SELECT }
  )) as { id: number }[];

  if (users.length === 0) return;
  const superadminId = users[0].id;

  const permissions = (await queryInterface.sequelize.query(
    `SELECT id FROM ${permissionsTable} WHERE route = '*' AND access = 'read_write'`,
    { type: QueryTypes.SELECT }
  )) as { id: number }[];

  if (permissions.length === 0) return;
  const wildcardPermissionId = permissions[0].id;

  await queryInterface.bulkInsert('user_permissions', [
    {
      userId: superadminId,
      permissionId: wildcardPermissionId,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  const dialect = (process.env.SQL_TYPE ?? 'postgres').toLowerCase();
  const rolesTable = dialect === 'postgres' ? '"Roles"' : 'Roles';
  const usersTable = dialect === 'postgres' ? '"Users"' : 'Users';

  const roles = (await queryInterface.sequelize.query(
    `SELECT id FROM ${rolesTable} WHERE name = 'superadmin'`,
    { type: QueryTypes.SELECT }
  )) as { id: number }[];

  if (roles.length === 0) return;

  const users = (await queryInterface.sequelize.query(
    `SELECT id FROM ${usersTable} WHERE ${dialect === 'postgres' ? '"roleId"' : 'roleId'} = ${roles[0].id}`,
    { type: QueryTypes.SELECT }
  )) as { id: number }[];

  if (users.length === 0) return;
  const superadminId = users[0].id;

  await queryInterface.bulkDelete('user_permissions', {
    userId: superadminId
  });
}
