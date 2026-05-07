import { QueryInterface } from 'sequelize';

const routes = [
  '*',
  'dashboard',
  'devotees',
  'pooja-seva',
  'annadhanam',
  'donations',
  'events',
  'campaigns',
  'inventory',
  'assets',
  'documents',
  'halls',
  'hall-bookings',
  'revenue',
  'parking',
  'staff',
  'temple-events',
  'volunteer',
  'duty'
];

export async function up(queryInterface: QueryInterface): Promise<void> {
  const now = new Date();

  const permissions = routes.flatMap((route) => [
    {
      route,
      access: 'read',
      createdAt: now,
      updatedAt: now
    },
    {
      route,
      access: 'read_write',
      createdAt: now,
      updatedAt: now
    }
  ]);

  await queryInterface.bulkDelete('permissions', {});
  await queryInterface.bulkInsert('permissions', permissions as never[]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('permissions', {
    route: routes
  } as never);
}
