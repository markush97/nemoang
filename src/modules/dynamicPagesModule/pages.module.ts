import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/config/config.module';
import { PermissionsModule } from '@app/permissions/permissions.module';
import { LinkService } from './link.service';
import { linkProviders } from './pages.providers';
import { LinkController } from './link.controller';

/*
* Just import this Module in the main Module
*/

@Module({
  imports: [
    ConfigModule,
    PermissionsModule,
    // Import optional SubModules
  ],
  controllers: [LinkController],
  providers: [LinkService, ...linkProviders],

  // If the Service is used by other modules => export it.
  exports: [LinkService],
})
export class PageModule {}
