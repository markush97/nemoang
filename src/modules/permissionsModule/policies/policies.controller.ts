import { Body, Controller, Get, UseGuards, Post } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { Policy } from './interfaces/policy.interface';
import { UpdateSubPolicyDto } from './dto/updateSubPolicy.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthRequirements } from '../auth/decorators/auth-requirement.decorator ';
import { TokenTypeEnum } from '../auth/enums/token-type.enum';
import { RequiredPermissionsEnum } from '../auth/enums/required-permission.enum';
import { Token } from '../auth/decorators/token.decorator';
import { AccessToken } from '../auth/interfaces/access-token.interface';
import { RolesService } from '../roles/roles.service';
import { UserService } from '../user/user.service';

@Controller('api/policies')
@UseGuards(AuthGuard)
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService, private readonly userService: UserService) {}

  /**
   * Get/List the all policies
   * @return {Promise<Policy[]>} A Promise to resolve into a Array of Policies
   */
  @Get()
  @AuthRequirements(TokenTypeEnum.CLIENT)
  public async getAll(): Promise<Policy[]> {
    return this.policiesService.list();
  }

  /**
   * Update all Policies
   *
   */
  @Post()
  @AuthRequirements(TokenTypeEnum.CLIENT)
  public async updatePolicy(
    @Body() updateSubPolicyDto: UpdateSubPolicyDto,
  ): Promise<Policy> {
    return this.policiesService.updateSubPolicy(updateSubPolicyDto);
  }

  /*
  * Get all Frontend Policies (marked by method: 'front')
  *
  * */
  @Get('frontend')
  @AuthRequirements(TokenTypeEnum.CLIENT, RequiredPermissionsEnum.NONE)
  public async getAllFrontendPolicies(@Token() token: AccessToken) {
    return this.policiesService.getFrontEndPermissions(await this.userService.getUserRoles(token.userId), token.userId);
  }
}
