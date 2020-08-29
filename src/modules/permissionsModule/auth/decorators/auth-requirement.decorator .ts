import { ReflectMetadata } from '@nestjs/common';
import { TokenTypeEnum } from '../enums/token-type.enum';
import { RequiredPermissionsEnum } from '@app/permissions/auth/enums/required-permission.enum';

export const AuthRequirements = (
  requiredTokenType: TokenTypeEnum,
  requiredPermissions?: RequiredPermissionsEnum
) => {
  return ReflectMetadata(
    'authrequirements',
    new AuthRequirementsHelper(requiredTokenType, requiredPermissions)
  );
};

export class AuthRequirementsHelper {
  private requiredTokenType: TokenTypeEnum;
  private requiredPermissions: RequiredPermissionsEnum;

  constructor(requiredTokenType: TokenTypeEnum, requiredPermissions: RequiredPermissionsEnum) {
    this.requiredTokenType = requiredTokenType;
    this.requiredPermissions = requiredPermissions;
  }

  public tokenIsOfType(tokenType: TokenTypeEnum): boolean {
    return tokenType === this.requiredTokenType;
  }

  public permissionIsOfType(
    requiredPermissions: RequiredPermissionsEnum
  ): boolean {
    if (!this.requiredPermissions) this.requiredPermissions = RequiredPermissionsEnum.ANY;
    return (
      requiredPermissions === this.requiredPermissions
      || (requiredPermissions !== RequiredPermissionsEnum.ANY && this.requiredPermissions === RequiredPermissionsEnum.EVERY)
    );
  }
}