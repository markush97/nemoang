import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(
        `./src/enviroments/${process.env.NODE_ENV}.env`,
      ), // Change path to current e.g.: development = './src/config/env/development.env'
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
