import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { AuthRequirementsHelper } from '@app/permissions/auth/decorators/auth-requirement.decorator ';
import { PoliciesService } from '@app/policies/policies.service';
import { RequiredPermissionsEnum } from '../enums/required-permission.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly policiesService: PoliciesService,
    private readonly authService: AuthService
  ) {}

  /**
   * Checks if a requester has the permissions to activate a (Controller-)Link
   * @param {ExecutionContext} context - the Context containing Requests, Results etc (for more info look on NestJS Documentation)
   * @return {Promise<boolean>} - wheater the requester is allowed or not
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check if decorator is present
    const authRequirements = this.reflector.get<AuthRequirementsHelper>(
      'authrequirements',
      context.getHandler()
    );
    const checkParams = this.reflector.get<number>(
      'checkParams',
      context.getHandler()
    );
    if (!authRequirements) {
      // no token requirements
      return true;
    } else {
      const req = context.switchToHttp().getRequest();

      if (
        req.headers.authorization &&
        (req.headers.authorization as string).split(' ')[0] === 'Bearer'
      ) {
        try {
          // validate token
          const token = (req.headers.authorization as string).split(' ')[1];

          if (
            authRequirements.permissionIsOfType(RequiredPermissionsEnum.NONE)
          ) {
            req.token = await this.authService.decodeAccessToken(token);
            return true;
          }

          const decodedToken = await this.authService.validateAccessToken(
            token
          );

          // check if token is of the right type
          if (!authRequirements.tokenIsOfType(decodedToken.type)) return false;
          // check if token has the necessary user roles

          let path = req.route.path.toLowerCase();

          if (checkParams && checkParams > 0) {
            const pathParts = path.split(':');
            path = pathParts[0];

            for (let index = 0; index < checkParams; index++) {
              path = path + req.params[Object.keys(req.params)[index]];
            }

            for (
              let index = checkParams + 1;
              index < pathParts.length;
              index++
            ) {
              path = path + '/:' + pathParts[index];
            }
          }

          if (
            !(await this.policiesService.anyAllowed(
              decodedToken.roles,
              decodedToken.userId,
              authRequirements,
              path,
              req.method.toLowerCase()
            ))
          )
            return false;
          // save token in request object
          req.token = decodedToken;

          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
}
