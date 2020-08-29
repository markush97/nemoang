import * as mongoose from 'mongoose';
import { ConfigService } from '@app/config/config.service';

export const databaseProviders = [
  {
    provide: 'DbConnectionToken',
    useFactory: async (config: ConfigService) => {
      (mongoose as any).Promise = global.Promise;
      await mongoose.connect(
        config.getMongoUri(),
        { useNewUrlParser: true },
      );

      return mongoose;
    },
    inject: [ConfigService],
  },
];
