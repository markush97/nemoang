import { Model } from 'mongoose';
import {
  Injectable,
  Inject,
  UnprocessableEntityException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { _ } from 'lodash';
import { Policy } from './interfaces/policy.interface';
import { RolesService } from '@app/roles/roles.service';
import { Types as MongooseTypes } from 'mongoose';
import { AddPolicyDto } from './dto/addPolicy.dto';
import { UpdateSubPolicyDto } from './dto/updateSubPolicy.dto';
import { doesNotReject, rejects } from 'assert';
import { RequiredPermissionsEnum } from '../auth/enums/required-permission.enum';
import {
  AuthRequirements,
  AuthRequirementsHelper,
} from '../auth/decorators/auth-requirement.decorator ';
import { SubPolicy } from './interfaces/subPolicy.interface';
import { AddSubPolicyDto } from './dto/addSubPolicy.dto';
import { MongoException } from '@app/core/exceptionHandling/mongo.exception';

@Injectable()
export class PoliciesService {
  constructor(
    private readonly rolesService: RolesService,
    @Inject('PolicyModelToken') private readonly policyModel: Model<Policy>
  ) {}

  public async findOne(criteria: object, projection?: string): Promise<Policy> {
    if (!criteria) throw new BadRequestException();
    const policy = await this.policyModel.findOne(criteria, projection).exec();
    return policy;
  }

  public async findOneById(policyId: MongooseTypes.ObjectId): Promise<Policy> {
    return this.findOne({ _id: policyId });
  }

  async updateSubPolicy(updatePolicyDto: UpdateSubPolicyDto): Promise<Policy> {
    let done;
    let options;

    if (updatePolicyDto.users) {
      if (updatePolicyDto.roles) {
        options = {
          $set: {
            'subPolicies.$.roles': updatePolicyDto.roles,
            'subPolicies.$.users': updatePolicyDto.users,
          },
        };
      } else {
        options = { $set: { 'subPolicies.$.users': updatePolicyDto.users } };
      }
    } else {
      if (updatePolicyDto.roles) {
        options = { $set: { 'subPolicies.$.roles': updatePolicyDto.roles } };
      } else {
        throw new BadRequestException();
      }
    }

    this.policyModel.updateOne(
      { 'subPolicies._id': updatePolicyDto._id },
      options,
      (err, res) => {
        if (err) {
          // TODO: create a good logger to log this for real
          done = new UnprocessableEntityException(err);
          // console.log('In update Policy:' + err);
        } else {
          done = res;
        }
      }
    );

    return done;
  }

  async invokePolicies(policies: Policy[]) {
    policies.forEach(policy => {
      this.addPolicy(policy);
    });
  }

  async addPolicy(policy: Policy) {
    this.policyModel.create(policy, err => {
      if (err) {
        return new MongoException(err);
      }
    });
  }

  async addSubPolicy(
    subPolicy: SubPolicy,
    policyName: string
  ): Promise<Policy> {
    const dbPolicy = this.policyModel.findOne({ policyName });
    dbPolicy.subPolicies.push(subPolicy);
    return dbPolicy.save();
  }

  async getIdByName(name: string): Promise<MongooseTypes.ObjectId[]> {
    let id;

    await this.policyModel.findOne({ policyname: name }, (err, res) => {
      if (err) {
        // TODO: create a good logger to log this for real
      } else {
        // Add Main Policy, if it doesn´t already exist
        if (res) {
          id = res._id;
        }
      }
    });
    return id;
  }

  async list(): Promise<Policy[]> {
    return this.policyModel.find();
  }

  async getPolicynamesForMethod(
    roles: string[],
    methods: string[]
  ): Promise<Policy[]> {
    return this.policyModel.find({
      'subPolicies.method': { $in: methods },
      'subPolicies.roles': { $in: roles },
    });
  }

  /**
   * check if any of the given roles has the required permissions
   * @param {ObjectId} roleid - The mongodb object ids of the roles the user has
   * @param {string} resource - the resource to check e.g. 'api/users/'
   * @param {string} method - The method to check e.g. 'get'
   * @return {boolean} Wheater any roles have enought permissions
   */
  public async anyAllowed(
    rolesIds: MongooseTypes.ObjectId[],
    userId: MongooseTypes.ObjectId,
    authRequirements: AuthRequirementsHelper,
    resource: string,
    method: string
  ): Promise<boolean> {
    if (authRequirements.permissionIsOfType(RequiredPermissionsEnum.NONE))
      return true;

    let hasUser = false;
    let hasRole = false;
    try {
      if (
        authRequirements.permissionIsOfType(RequiredPermissionsEnum.ROLE) ||
        authRequirements.permissionIsOfType(RequiredPermissionsEnum.ANY)
      ) {
        const role_res = await this.policyModel.find(
          {
            'subPolicies.resource': resource,
            'subPolicies.method': method,
            'subPolicies.roles': { $in: rolesIds },
          },
          {
            _id: 1,
          }
        );
        hasRole = role_res[0] != null && role_res[0]._id != null;
      } else {
        hasRole = true;
      }

      if (
        authRequirements.permissionIsOfType(RequiredPermissionsEnum.USER) ||
        authRequirements.permissionIsOfType(RequiredPermissionsEnum.ANY)
      ) {
        const user_res = await this.policyModel.find(
          {
            'subPolicies.resource': resource,
            'subPolicies.method': method,
            'subPolicies.users': userId,
          },
          {
            _id: 1,
          }
        );
        hasUser = user_res[0] != null && user_res[0]._id != null;
      } else {
        hasUser = true;
      }
    } catch (error) {
      throw error;
    }

    if (authRequirements.permissionIsOfType(RequiredPermissionsEnum.ANY)) {
      return hasUser || hasRole;
    } else {
      return hasUser && hasRole;
    }
  }

  async loadFrontEndPermissions(
    rolesIds: string[],
    userId: MongooseTypes.ObjectId
  ): Promise<string[]> {
    const result = [];

    const perms = await this.policyModel
      .aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  { 'subPolicies.users': userId },
                  { 'subPolicies.roles': { $in: rolesIds } },
                ],
              },
              { 'subPolicies.method': 'front' },
            ],
          },
        },

        { $unwind: '$subPolicies' },

        {
          $match: {
            $and: [
              {
                $or: [
                  { 'subPolicies.users': userId },
                  { 'subPolicies.roles': { $in: rolesIds } },
                ],
              },
              { 'subPolicies.method': 'front' },
            ],
          },
        },
        {
          $project: {
            _id: false,
            resource: '$subPolicies.resource',
          },
        },
      ])
      .exec();

    perms.forEach(element => {
      result.push(element.resource);
    });

    return result;
  }

  async getFrontEndPermissions(
    rolesIds: string[],
    userId: MongooseTypes.ObjectId
  ): Promise<string[]> {
    return this.loadFrontEndPermissions(rolesIds, userId);
  }
}
