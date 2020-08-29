import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignInReturnValue } from './interfaces/signin-returnvalue.interface';
import { SignOutDto } from './dto/sign-out.dto';
import { SignOutReturnValue } from './interfaces/signout-returnvalue.interface';
import { UserService } from '@app/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ConfigService } from '@app/core/config/config.service';
import { AuthGuard } from './guards/auth.guard';
import { RefreshAccessTokenReturnValue } from './interfaces/refreshToken-returnvalue.interface';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { RejectRefreshTokenDto } from './dto/rejectRefreshToken.dto';
import { TokenTypeEnum } from './enums/token-type.enum';
import { AuthRequirements } from './decorators/auth-requirement.decorator ';
import { Token } from './decorators/token.decorator';
import { AccessToken } from './interfaces/access-token.interface';
import { UserAgent } from '../user/decorators/userAgent.decorator';
import { IP } from '../user/decorators/ip.decorator';
import { RequiredPermissionsEnum } from './enums/required-permission.enum';

@Controller('api/auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly config: ConfigService
  ) {}

  /**
   * Signup a User
   * @param {SignUpDto} signUpDto - The data-transfer-object which contains all user data required for signup
   * @return {Promise<User>} - A Promise resolving in the created UserObject
   */
  @Post('signup')
  public async signUp(
    @UserAgent() userAgent: string,
    @IP() ip: string,
    @Body() signUpDto: SignUpDto
  ): Promise<SignInReturnValue> {
    if (this.config.canRegister) {
      const user = await this.userService.signUp(signUpDto);

      return this.authService.signIn(
        {
          emailOrUsername: user.email,
          password: signUpDto.password,
          perma: false,
        },
        userAgent,
        ip
      );
    } else {
      throw new BadRequestException('User registering is disabled!');
    }
  }

  /**
   * Sign in user via email (or username) and password.
   * @param {SignInDto} signInDto - The data-transfer-object which contains all user data required for signIn
   * @return {Promise<SignInReturnValue>} A promise resolving in the sign in return value
   */
  @Post('signin')
  async signIn(
    @UserAgent() userAgent: string,
    @IP() ip: string,
    @Body() signInDto: SignInDto
  ): Promise<SignInReturnValue> {
    return this.authService.signIn(signInDto, userAgent, ip);
  }

  /**
   * Sign Out
   * @param {SignOutDto} signOutDto - The data-transfer-object which contains all user data required for signing out
   * @return {Promise<SignOutReturnValue>} A promise resolving in the sign out return value
   */
  @Post('signout')
  @AuthRequirements(TokenTypeEnum.CLIENT, RequiredPermissionsEnum.NONE)
  async signOut(
    @Body() signOutDto: SignOutDto,
    @Token() token: AccessToken
  ): Promise<SignOutReturnValue> {
    return this.authService.signOut(signOutDto, token.userId);
  }

  @Post('token')
  @AuthRequirements(TokenTypeEnum.CLIENT, RequiredPermissionsEnum.NONE)
  async refreshAccessToken(
    @Body() refreshToken: RefreshAccessTokenDto
  ): Promise<RefreshAccessTokenReturnValue> {
    return this.authService.refreshAccessToken(refreshToken.refreshToken);
  }

  @Delete('token')
  @AuthRequirements(TokenTypeEnum.CLIENT, RequiredPermissionsEnum.NONE)
  async rejectRefreshToken(
    @Body() refreshToken: RejectRefreshTokenDto,
    @Token() token: AccessToken
  ) {
    return this.userService.rejectRefreshToken(
      token.userId,
      refreshToken.refreshToken_id
    );
  }

  @Delete('tokens')
  @AuthRequirements(TokenTypeEnum.CLIENT, RequiredPermissionsEnum.NONE)
  async rejectAllRefreshTokens(@Token() token: AccessToken) {
    return this.userService.rejectAllRefreshToken(token.userId);
  }
}
