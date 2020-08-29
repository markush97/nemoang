import { Injectable } from '@nestjs/common';
import { ConfigService } from '@app/core/config/config.service';
import { UserService } from '@app/user/user.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class TestRoles {
  constructor(private readonly rolesService: RolesService) {
    this.rolesService
      .addRole({
        rolename: 'admin',
      })
      .catch(
        err => (err.message.message.code === 11000 ? null : console.error(err))
      ); // Add default Policies to Database &

    this.rolesService
      .addRole({
        rolename: 'user',
      })
      .catch(
        err => (err.message.message.code === 11000 ? null : console.error(err))
      ); // Add default Policies to Database &
  }
}
