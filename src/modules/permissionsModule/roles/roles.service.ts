import {
  Injectable,
  Inject,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Role } from './interfaces/roles.interface';
import { Model, Types as MongooseTypes } from 'mongoose';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject('RoleModelToken') private readonly roleModel: Model<Role>,
  ) {}

  /**
   * Get/List all roles
   * @return {role[]} A list containing all roles
   */
  public async findAll(): Promise<Role> {
    return this.roleModel.find().exec();
  }

  /**
   * Update an existing role
   * @param {ObjectId} roleid - The mongodb object id
   * @param {UpdateRoleDto} updateroleDto - A data-transfer-object describing the role to be updated
   * @return {Role} The updated role
   */
  public async update(
    roleid: MongooseTypes.ObjectId,
    updateroleDto: UpdateRoleDto,
  ): Promise<Role> {
    const dbRole: Model<Role> = await this.findOneById(roleid);
    if (!dbRole) throw new BadRequestException();
    dbRole.set(updateroleDto);
    return dbRole.save();
  }

  /**
   * Get a single role through its identifier
   * @param {ObjectId} roleid - The mongodb object id
   * @return {Role} A single role
   */
  public async findOneById(roleid: MongooseTypes.ObjectId): Promise<Role> {
    return this.roleModel.findOneById(roleid);
  }

  /**
   * Delete an existing role
   * @param {ObjectId} roleid - The mongodb object id
   * @return {Role} The deleted role
   */
  public async delete(roleid: MongooseTypes.ObjectId): Promise<Role> {
    const dbRole: Model<Role> = await this.findOneById(roleid);
    if (!dbRole) throw new BadRequestException();
    return dbRole.remove();
  }

  public async list() {
    return this.roleModel.find({});
  }

  public async addRole(role: Role): Promise<Role> {
    return this.roleModel.create(role);

  }
}
