import { Body, Controller, Get, UseGuards, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './interfaces/roles.interface';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AddRoleDto } from './dto/add-role.dto';

@Controller('api/roles')
@UseGuards(AuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Get/List the all policies
   * @return {Promise<Policy[]>} A Promise to resolve into a Array of Policies
   */
  @Get()
  public async getAll(): Promise<Role[]> {
    return this.rolesService.list();
  }

  @Post()
  public async addRole(@Body() addRoleDto: AddRoleDto): Promise<Role> {
    return this.rolesService.addRole(addRoleDto);

  }
}
