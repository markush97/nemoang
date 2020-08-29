import { Module, forwardRef } from '@nestjs/common';
import { CoreModule } from '@app/core/core.module';
import { RolesService } from './roles.service';
import { rolesProviders } from './roles.providers';
import { RolesController } from './roles.controller';
import { PoliciesModule } from '../policies/policies.module';
@Module({
  imports: [CoreModule, forwardRef(() => PoliciesModule)],
  controllers: [RolesController],
  providers: [RolesService, ...rolesProviders],
  exports: [RolesService],
})
export class RolesModule {}
