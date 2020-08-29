import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/config/config.module';
import { DatabaseModule } from '@app/database/database.module';
import { CoreController } from './core.controller';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [CoreController],
  providers: [],
  exports: [DatabaseModule, ConfigModule],
})
export class CoreModule {}
