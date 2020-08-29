import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseModule } from '@app/database/database.module';
import { UserModule } from '@app/user/user.module';
import { AuthController } from './auth.controller';
import { PoliciesService } from '@app/policies/policies.service';
import { PoliciesModule } from '@app/policies/policies.module';
import { RolesModule } from '@app/roles/roles.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule), PoliciesModule],
  controllers: [AuthController],
  providers: [AuthService, PoliciesService],
  exports: [AuthService],
})
export class AuthModule {}
