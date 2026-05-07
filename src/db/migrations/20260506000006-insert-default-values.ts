import { QueryInterface, QueryTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

function getRequiredEnv(
  key: 'COMPANY_EMAIL' | 'COMPANY_PASSWORD'
): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(
      `${key} environment variable is required for default company admin seeding`
    );
  }

  return value;
}

export async function up(queryInterface: QueryInterface): Promise<void> {
  const timestamp = new Date();
  const companyEmail = getRequiredEnv('COMPANY_EMAIL');
  const companyPassword = getRequiredEnv('COMPANY_PASSWORD');
  const companyPasswordHash = await bcrypt.hash(companyPassword, 12);


  await queryInterface.bulkDelete('Users', { email: companyEmail });
  await queryInterface.bulkDelete('Roles', { id: [1, 2, 3] });


  await queryInterface.bulkInsert('Roles', [
    {
      id: 1,
      name: 'superadmin',
      description: 'Temple Superadmin',
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      id: 2,
      name: 'admin',
      description: 'Admin user',
      createdAt: timestamp,
      updatedAt: timestamp
    },
    {
      id: 3,
      name: 'company_superadmin',
      description: 'Company Superadmin',
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ]);


  await queryInterface.bulkInsert('Users', [
    {
      firstName: 'Company',
      lastName: 'Superadmin',
      email: companyEmail,
      password: companyPasswordHash,
      mfaCode: '',
      mfaFailedCount: 0,
      mfaAccountLockedUntil: null,
      roleId: 3,
      accountStatus: 'active',
      isFirstLogin: true,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  ]);

  // Insert wildcard permission for the company superadmin if permissions exist
  try {
    // Note: The new schema uses 'action' instead of 'route'
    const permissions = (await queryInterface.sequelize.query(
      "SELECT id FROM Permissions WHERE action = '*' LIMIT 1",
      { type: QueryTypes.SELECT }
    )) as { id: number }[];

    if (permissions.length > 0) {
      const wildcardPermission = permissions[0];
      const users = (await queryInterface.sequelize.query(
        `SELECT id FROM Users WHERE email = '${companyEmail}' LIMIT 1`,
        { type: QueryTypes.SELECT }
      )) as { id: number }[];

      if (users.length > 0) {
        const superUser = users[0];
        // Ensure user_permissions table exists before inserting
        await queryInterface.bulkInsert('user_permissions', [
          {
            userId: superUser.id,
            permissionId: wildcardPermission.id,
            createdAt: timestamp,
            updatedAt: timestamp
          }
        ]);
      }
    }
  } catch (error) {
    // Ignore if Permissions or user_permissions table isn't set up yet or column missing
    console.warn('Skipping default permissions seeding: ', error instanceof Error ? error.message : error);
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  const companyEmail = process.env.COMPANY_EMAIL?.trim();

  if (companyEmail) {
    await queryInterface.bulkDelete('Users', { email: companyEmail });
  }

  await queryInterface.bulkDelete('Roles', { id: [1, 2, 3] });
}
