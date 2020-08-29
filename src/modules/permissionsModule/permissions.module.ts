import { Module } from '@nestjs/common';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from '@app/auth/auth.module';
import { PoliciesModule } from '@app/policies/policies.module';
import { RolesModule } from '@app/roles/roles.module';
import { DefaultPolicies } from './seeds/default_policies';
import { MasterUser } from './seeds/master_user';
import { TestUser } from './seeds/test_user';

@Module({
  imports: [UserModule, AuthModule, PoliciesModule, RolesModule],

  providers: [DefaultPolicies, MasterUser, TestUser],

  exports: [UserModule, AuthModule, PoliciesModule, RolesModule],
})
export class PermissionsModule {}
