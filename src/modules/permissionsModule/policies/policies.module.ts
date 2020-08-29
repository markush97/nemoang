import { Module, forwardRef } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { policyProviders } from './policies.providers';
import { PoliciesController } from './policies.controller';
import { CoreModule } from '@app/core/core.module';
import { RolesModule } from '@app/roles/roles.module';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [
    CoreModule,
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),
  ],

  providers: [PoliciesService, ...policyProviders],

  controllers: [PoliciesController],
  exports: [PoliciesService, ...policyProviders],
})
export class PoliciesModule {}
