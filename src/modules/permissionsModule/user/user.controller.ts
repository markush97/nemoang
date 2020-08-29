import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { Types as MongooseTypes } from 'mongoose';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';
import { UpdateUserSelfDto } from './dto/update-user-self.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ObjectIdPipe } from '@app/core/pipes/object-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetAllUsersResultDto } from './dto/GetAllUserResult.dto';
import { AuthController } from '../auth/auth.controller';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthRequirements } from '../auth/decorators/auth-requirement.decorator ';
import { TokenTypeEnum } from '../auth/enums/token-type.enum';
import { Token } from '../auth/decorators/token.decorator';
import { AccessToken } from '../auth/interfaces/access-token.interface';
import { RequiredPermissionsEnum } from '../auth/enums/required-permission.enum';

@Controller('api/users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Routes for authenticated users only
   */

  /**
   * Get the own user
   * @return {User} A single user
   */
  @Get('self')
  @AuthRequirements(TokenTypeEnum.CLIENT, RequiredPermissionsEnum.NONE)
  public async getSelf(@Token() token: AccessToken): Promise<User> {
    return this.userService.findOneById(token.userId);
  }

  /**
   * Update the own user
   * @param {UpdateUserSelfDto} updateUserSelfDto - A data-transfer-object describing the user to be updated
   * @return {User} The updated user
   */
  @Post('self')
  @AuthRequirements(TokenTypeEnum.CLIENT, RequiredPermissionsEnum.NONE)
  public async updateSelf(
    @Token() token: AccessToken,
    @Body() updateUserSelfDto: UpdateUserSelfDto,
  ): Promise<User> {
    return this.userService.updateSelf(token.userId, updateUserSelfDto);
  }

  /**
   * Routes for administrators only
   */

  /**
   * Get all users
   * @return {User[]} A list containing all users
   */
  @Get()
  @AuthRequirements(TokenTypeEnum.CLIENT)
  public async getAll(@Query() query): Promise<GetAllUsersResultDto> {
    return this.userService.findAllSort(
      query.sort,
      query.order,
      parseInt(query.page, 10),
      parseInt(query.perPage, 10)
    );
  }

  /**
   * Create a new user
   * @param {CreateUserDto} createUserDto - A data-transfer-object describing the new user
   * @return {User} The newly created user
   */
  @Post()
  @AuthRequirements(TokenTypeEnum.CLIENT)
  public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  /**
   * Get all users
   * @return {User[]} A list containing all users
   */
  @Get(':userid')
  @AuthRequirements(TokenTypeEnum.CLIENT)
  public async getOne(
    @Param('userid', new ObjectIdPipe()) userid: MongooseTypes.ObjectId,
  ): Promise<User> {
    return this.userService.findOneById(userid);
  }

  /**
   * Update an existing user
   * @param {ObjectId} userid - The user id
   * @param {UpdateUserDto} updateUserDto - A data-transfer-object describing the user to be updated
   * @return {User} The updated user
   */
  @Post(':userid')
  @AuthRequirements(TokenTypeEnum.CLIENT)
  public async update(
    @Param('userid', new ObjectIdPipe()) userid: MongooseTypes.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(userid, updateUserDto);
  }

  /**
   * Delete an existing user
   * @param {ObjectId} userid - The user id
   * @return {User} The deleted user
   */
  @Delete(':userid')
  @AuthRequirements(TokenTypeEnum.CLIENT)
  public async delete(
    @Param('userid', new ObjectIdPipe()) userid: MongooseTypes.ObjectId,
  ): Promise<User> {
    return this.userService.delete(userid);
  }
}
