import { Injectable } from '@nestjs/common';
import { ConfigService } from '@app/core/config/config.service';
import { UserService } from '@app/user/user.service';

@Injectable()
export class MasterUser {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    this.userService
      .create(this.configService.getMasterUserData())
      .catch(
        err => (err.message.message.code === 11000 ? null : console.error(err))
      ); // igrore Error Message if it is a mongo Error (someday there will be a better solution)
  }
}
