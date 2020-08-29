import { Policy } from '@app/policies/interfaces/Policy.interface';
import { Injectable } from '@nestjs/common';
import { PoliciesService } from '@app/policies/policies.service';

const defaultPoliciesList: Policy[] = [
  {
    policyname: 'PermissionsModule',
    parent: undefined,
    subPolicies: [
      {
        policyname: 'adminpanel',
        resource: '/admin',
        method: 'front',
        roles: ['admin'],
        users: [],
      },
    ],
  },
  {
    policyname: 'UsersModule',
    subPolicies: [
      {
        policyname: 'List all Users',
        resource: '/api/users',
        method: 'get',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Show an User´s data',
        resource: '/api/users/:userid',
        method: 'get',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Update an User',
        resource: '/api/users/:userid',
        method: 'post',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Delete an User',
        resource: '/api/users/:userid',
        method: 'delete',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Front: Add a User',
        resource: '/admin/user/new',
        method: 'front',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Front: Edit a User',
        resource: '/admin/user/:id',
        method: 'front',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'AdminPanel: User',
        resource: '/admin/user',
        method: 'front',
        roles: ['admin'],
        users: [],
      },
    ],
    parent: 'PermissionsModule',
  },
  {
    policyname: 'RolesModule',
    subPolicies: [
      {
        policyname: 'Show a Roles´s data',
        resource: '/api/roles',
        method: 'get',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'AdminPanel: Roles',
        resource: '/admin/roles',
        method: 'front',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Update a Role',
        resource: '/api/roles',
        method: 'post',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Delete a Role',
        resource: '/api/roles',
        method: 'delete',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'List all Roles',
        resource: '/api/roles/list',
        method: 'get',
        roles: ['admin'],
        users: [],
      },
    ],
    parent: 'PermissionsModule',
  },
  {
    policyname: 'PoliciesModule',
    subPolicies: [
      {
        policyname: 'List all Policies',
        resource: '/api/policies',
        method: 'get',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Change a Policy',
        resource: '/api/policies',
        method: 'post',
        roles: ['admin'],
        users: [],
      },
    ],
    parent: 'PermissionsModule',
  },
];

@Injectable()
export class DefaultPolicies {
  constructor(private readonly policiesService: PoliciesService) {
    this.policiesService
      .invokePolicies(defaultPoliciesList)
      .catch(
        err => (err.message.message.code === 11000 ? null : console.error(err))
      ); // Ignore Mongoose Errors. Someday there will be a better solution
  }
}
