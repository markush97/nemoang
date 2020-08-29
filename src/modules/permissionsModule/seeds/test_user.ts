import { Injectable } from '@nestjs/common';
import { ConfigService } from '@app/core/config/config.service';
import { UserService } from '@app/user/user.service';

@Injectable()
export class TestUser {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    this.userService
      .create({
        active: true,
        email: 'test_user@mymail.com',
        password: '1testUserPassword!',
        username: 'test_user',
        roles: ['user']
      })
      .catch(
        err => (err.message.message.code === 11000 ? null : console.error(err))
      ); // Add default Policies to Database &
  }
}
