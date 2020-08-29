import { Connection } from 'mongoose';
import { RoleSchema } from './schemas/roles.schema';

export const rolesProviders = [
  {
    provide: 'RoleModelToken',
    useFactory: (connection: Connection) =>
      connection.model('Role', RoleSchema),
    inject: ['DbConnectionToken'],
  },
];
