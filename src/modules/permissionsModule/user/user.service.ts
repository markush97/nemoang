import {
  BadRequestException,
  Injectable,
  Inject,
  NotFoundException,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare as bcryptCompare } from 'bcrypt';
import { Model, Types as MongooseTypes } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserSelfDto } from './dto/update-user-self.dto';
import { User } from './interfaces/user.interface';
import { GetAllUsersResultDto } from './dto/GetAllUserResult.dto';
import { SignUpDto } from '@app/auth/dto/sign-up.dto';
import { Types } from 'mongoose';
import { userInfo } from 'os';
import { RefreshToken } from '../auth/interfaces/refresh-token.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserModelToken') private readonly userModel: Model<User>
  ) {}

  /**
   * Get all users sorted
   * @return {GetAllUsersResultDto} A list items: containing all Users (with limit, sort & page) & count: with the count of all users
   * @param {string} sort - The defined criterias
   * @param {string} order - Optional projection field (i.e. which fields to return)
   * @param {number} page - Which page to show (simply skips the first items)
   * @param {number} limit - How much items to show per page
   */
  public async findAllSort(
    sort: string,
    order: string,
    page: number,
    limit: number
  ): Promise<GetAllUsersResultDto> {
    const sortObject = {};
    const stype = sort;
    const sdir: number = order === 'desc' ? -1 : 1;

    sortObject[stype] = sdir;

    return {
      items: await this.userModel
        .find()
        .sort(sortObject)
        .skip(limit * page)
        .limit(limit)
        .exec(),
      count: await this.userModel.countDocuments(),
    };
  }

  /**
   * Get a single user through defined criterias
   * @param {object} criteria - The defined criterias
   * @param {string} projection - Optional projection field (i.e. which fields to return)
   * @return {User} A single user
   */
  public async findOne(criteria: object, projection?: string): Promise<User> {
    if (!criteria) throw new BadRequestException('Could not find user!');
    const user = await this.userModel.findOne(criteria, projection).exec();
    return user;
  }

  /**
   * Get a single user through its email address
   * @param {string} email - The user's email address
   * @return {User} A single user
   */
  public async findOneByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }

  /**
   * Check if a user with the provided password and Email/Username does exist and return him if so
   * @param {string} email - The user's email address
   * @return {User} A single user
   */
  public async validateUser(
    emailOrUsername: string,
    password: string
  ): Promise<Model<User>> {
    const user: User = await this.findOne(
      { $or: [{ email: emailOrUsername }, { username: emailOrUsername }] },
      '+password'
    );
    if (user && user.active && (await bcryptCompare(password, user.password))) {
      user.password = undefined;
      return user;
    }
  }

  /**
   * Get a single user through its identifier
   * @param {ObjectId} userid - The mongodb object id
   * @return {User} A single user
   */
  public async findOneById(userid: MongooseTypes.ObjectId): Promise<User> {
    return this.findOne({ _id: userid });
  }

  /**
   * Create a new user
   * @param {CreateUserDto} createUserDto - A data-transfer-object describing the new user
   * @return {User} The newly created user
   */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  public async signUp(signUpDto: SignUpDto): Promise<User> {
    const createdUser = new this.userModel(signUpDto);
    return createdUser.save();
  }

  /**
   * Update an existing user
   * @param {ObjectId} userid - The mongodb object id
   * @param {UpdateUserDto} updateUserDto - A data-transfer-object describing the user to be updated
   * @return {User} The updated user
   */
  public async update(
    userid: MongooseTypes.ObjectId,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    const dbUser: Model<User> = await this.findOneById(userid);
    if (!dbUser) {
      throw new NotFoundException('Couldn´t find/load user to edit!');
    } else {
      dbUser.set(updateUserDto);
      return dbUser.save();
    }
  }

  /**
   * Update the own user
   * @param {String} email - The email address of the current user
   * @param {UpdateUserDto} updateUserDto - A data-transfer-object describing the user to be updated
   * @return {User} The updated user
   */
  public async updateSelf(
    userId: string,
    updateUserSelfDto: UpdateUserSelfDto
  ): Promise<User> {
    const dbUser: Model<User> = await this.findOneById(userId);
    if (!dbUser) {
      throw new NotFoundException('Couldn´t find/load user to edit!');
    } else {
      dbUser.set(updateUserSelfDto);

      return dbUser.save();
    }
  }

  /**
   * Delete an existing user
   * @param {ObjectId} userid - The mongodb object id
   * @return {User} The deleted user
   */
  public async delete(userid: MongooseTypes.ObjectId): Promise<User> {
    const dbUser: Model<User> = await this.findOneById(userid);
    if (!dbUser) {
      throw new NotFoundException();
    } else {
      return dbUser.remove('Couldn´t find/load user to delete!');
    }
  }

  public async addRefreshToken(token: RefreshToken, user: Model<User>) {
    this.userModel.findOneAndUpdate(
      {
        _id: user.id,
      },
      { $push: { refreshtoken: token } },
      (err, res) => {}
    );
  }

  public async rejectRefreshToken(userId: string, refresh_id: string) {
    const dbUser = await this.userModel.findOne({ _id: userId }).exec();
    if (!dbUser) {
      throw new NotFoundException('Couldn´t find/load user to delete Token!');
    } else {
      if (Types.ObjectId.isValid(refresh_id)) {
        dbUser
          .updateOne({
            $pull: {
              refreshtoken: {
                $or: [{ token: refresh_id }, { _id: refresh_id }],
              },
            },
          })
          .exec();
      } else {
        dbUser
          .updateOne({
            $pull: {
              refreshtoken: { token: refresh_id },
            },
          })
          .exec();
      }
    }
  }

  public async rejectAllRefreshToken(userId: string) {
    const dbUser = await this.userModel.findOne({ _id: userId }).exec();
    if (!dbUser) {
      throw new NotFoundException('Couldn´t find/load user to delete Tokens!');
    } else {
      dbUser
        .updateOne({
          $set: {
            refreshtoken: [],
          },
        })
        .exec();
    }
  }

  public async findOneByToken(refreshToken: string): Promise<User> {
    return this.userModel
      .findOne({ 'refreshtoken.token': refreshToken })
      .exec();
  }

  public async getUserRoles(userId: string): Promise<MongooseTypes.ObjectId[]> {
    const dbUser = await  this.userModel.findOne({ _id: userId}).exec();

    if (!dbUser) {
      throw new NotFoundException('Couldn´t find/load user to get all roles!');

    } else {
      return dbUser.roles;

    }
  }
}
