import { Connection } from 'mongoose';
import { LinkSchema } from './schemas/linkSchema';

export const linkProviders = [
  {
    provide: 'LinkModelToken',
    useFactory: (connection: Connection) =>
      connection.model('Links', LinkSchema),
    inject: ['DbConnectionToken'],
  },
];
