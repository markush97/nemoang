import { Connection } from 'mongoose';
import { DynamicContentSchema } from './schemas/contentSchema';

export const contentProviders = [
  {
    provide: 'ContentModelToken',
    useFactory: (connection: Connection) =>
      connection.model('Contents', DynamicContentSchema),
    inject: ['DbConnectionToken'],
  },
];
