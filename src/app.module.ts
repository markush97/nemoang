import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { CoreModule } from '@app/core/core.module';
import { PermissionsModule } from '@app/permissions/permissions.module';
import { ContentModule } from 'modules/contentModule/content.module';
import { PageModule } from 'modules/dynamicPagesModule/pages.module';

@Module({
  imports: [CoreModule, PermissionsModule, ContentModule, PageModule],
  providers: [
    // global pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {}
