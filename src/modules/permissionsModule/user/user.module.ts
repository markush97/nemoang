import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CoreModule } from '@app/core/core.module';
import { userProviders } from './user.providers';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [CoreModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, ...userProviders],
  exports: [UserService],
})
export class UserModule {}
