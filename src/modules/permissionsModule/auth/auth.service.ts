import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { UserService } from '@app/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignInReturnValue } from './interfaces/signin-returnvalue.interface';
import { SignOutDto } from './dto/sign-out.dto';
import { SignOutReturnValue } from './interfaces/signout-returnvalue.interface';
import { User } from '@app/user/interfaces/user.interface';
import { ConfigService } from '@app/config/config.service';
import { PoliciesService } from '../policies/policies.service';
import { randomBytes } from 'crypto';
import { RefreshAccessTokenReturnValue } from './interfaces/refreshToken-returnvalue.interface';
import { RefreshToken } from './interfaces/refresh-token.interface';
import { AccessToken } from './interfaces/access-token.interface';
import { TokenTypeEnum } from './enums/token-type.enum';
import iplocation from 'iplocation';

@Injectable()
export class AuthService {
  private jwtPrivateKey: Buffer;
  private jwtPublicKey: Buffer;

  constructor(
    private readonly configService: ConfigService,
    private readonly policySerice: PoliciesService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
    try {
      this.jwtPrivateKey = fs.readFileSync('src/enviroments/key.pem');
      this.jwtPublicKey = fs.readFileSync('src/enviroments/public.pem');
    } catch (err) {
      throw new Error('One or more certificates could not be loaded');
    }
  }

  /**
   * Sign in user via email (or username) and password.
   * @param {SignInDto} signInDto - The data-transfer-object which contains all user data required for signIn
   * @return {Promise<SignInReturnValue>} A promise resolving in the sign in return value
   */
  public async signIn(
    signInDto: SignInDto,
    userAgent: string,
    ip: string
  ): Promise<SignInReturnValue> {
    // get User from databse and validate if the password and username/email match

    const user = await this.userService.validateUser(
      signInDto.emailOrUsername,
      signInDto.password
    );
    if (!user) throw new UnauthorizedException('invalid credentials');

    // create accessToken
    const accessToken = this.createAccessTokenFromUser(user);

    // create return object
    let returnValue: SignInReturnValue;

    if (signInDto.perma === true) {
      const location_res = await iplocation(ip);
      let location;

      if (location_res && location_res.city)
        location = location_res.countryCode + ':' + location_res.city;

      const refreshToken: RefreshToken = {
        token: this.createRefreshTokenFromUser(user),
        info: {
          userAgent,
          ip,
          location,
        },
      };

      returnValue = {
        access_token: accessToken,
        refresh_token: refreshToken.token,
        expires_in: this.configService.getTokenExpiration(),
        user,
        permissions: await this.policySerice.getFrontEndPermissions(user.roles, user._id)
      };

      this.userService.addRefreshToken(refreshToken, user);
    } else {
      returnValue = {
        access_token: accessToken,
        expires_in: this.configService.getTokenExpiration(),
        user,
        permissions: await this.policySerice.getFrontEndPermissions(user.roles, user._id)
      };
    }

    return returnValue;
  }

  /**
   * Sign Out
   * @param {SignOutDto} signOutDto - The data-transfer-object which contains all user data required for signing out
   * @return {Promise<SignOutReturnValue>} A promise resolving in the sign out return value
   */
  public async signOut(
    signOutDto: SignOutDto,
    userId: string
  ): Promise<SignOutReturnValue> {
    if (signOutDto.refresh_token) {
      this.userService.rejectRefreshToken(userId, signOutDto.refresh_token);
    }
    return { signedout: true };
  }

  /**
   * Generate an access token for a given user
   * @param {User} user - The user for whom to create the token
   * @return {string} The generated access token
   */
  private createAccessTokenFromUser(user: User): string {
    const payload: AccessToken = {
      type: TokenTypeEnum.CLIENT,
      userId: user._id,
      roles: user.roles,
    };
    return jwt.sign(payload, this.jwtPrivateKey, {
      algorithm: 'RS256',
      expiresIn: this.configService.getTokenExpiration(),
      issuer: 'CLIENT',
    });
  }

  /**
   * Validate an access token. Throws an exception when the token is invalid
   * @param {string} token - The token to validate
   * @return {AccessToken} The decoded token
   */
  public validateAccessToken(accessToken: string): AccessToken {
    return jwt.verify(accessToken, this.jwtPublicKey, {
      issuer: 'CLIENT',
    }) as AccessToken;
  }

  public decodeAccessToken(accessToken: string): AccessToken {
    return jwt.verify(accessToken, this.jwtPublicKey, { issuer: 'CLIENT', ignoreExpiration: true});
  }

  public createRefreshTokenFromUser(user: User): string {
    return user._id.toString() + '.' + randomBytes(120).toString('hex');
  }

  public async refreshAccessToken(
    token: string
  ): Promise<RefreshAccessTokenReturnValue> {
    const dbUser = await this.userService.findOneByToken(token);

    if (!dbUser) {
      throw new NotFoundException('refresh-token-not-found');
    } else {
      return {
        access_token: this.createAccessTokenFromUser(dbUser),
        expires_in: this.configService.getTokenExpiration(),
        permissions: await this.policySerice.getFrontEndPermissions(dbUser.roles, dbUser._id)
      };
    }
  }
}
