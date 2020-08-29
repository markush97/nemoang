import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/config/config.module';
import { PermissionsModule } from '@app/permissions/permissions.module';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { contentProviders } from './content.providers';
import { DefaultPolicies } from './seeds/default_policies';

/*
* Just import this Module in the main Module
*/

@Module({
  imports: [
    ConfigModule,
    PermissionsModule,
    // Import optional SubModules
  ],
  controllers: [ContentController],
  providers: [ContentService, ...contentProviders, DefaultPolicies],

  // If the Service is used by other modules => export it.
  exports: [ContentService],
})
export class ContentModule {}
