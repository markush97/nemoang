import { Policy } from '@app/policies/interfaces/Policy.interface';
import { Injectable } from '@nestjs/common';
import { PoliciesService } from '@app/policies/policies.service';

/*
*Declare default Permissions here, which are init on the Database
*!!IMPORTANT: ALWAYS DECLARE PARENT POLICIES FIRST!!
*/
const defaultPoliciesList: Policy[] = [
  {
    policyname: 'ContentModule',
    parent: undefined,
    subPolicies: [
      {
        policyname: 'List all Policies',
        resource: '/admin/content',
        method: 'front',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Show Content in detail',
        resource: '/admin/content/:id',
        method: 'front',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Update ContentCategory',
        resource: '/api/content',
        method: 'post',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Update ContentCategory',
        resource: '/api/content',
        method: 'put',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Update ContentCategory',
        resource: '/api/content',
        method: 'get',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Create new ContentCategory',
        resource: '/admin/content/new',
        method: 'front',
        roles: ['admin'],
        users: [],
      },
      {
        policyname: 'Content Data',
        resource: '/admin/content/data',
        method: 'front',
        roles: ['admin'],
        users: [],
      },
    ],
  },
  {
    policyname: 'DynamicContents',
    parent: undefined,
    subPolicies: [],
  },
];

@Injectable()
export class DefaultPolicies {
  constructor(private readonly policiesService: PoliciesService) {
    this.policiesService.invokePolicies(defaultPoliciesList).catch(
      err => (err.message.message.code === 11000 ? null : console.error(err))
    ); // Ignore Mongoose Errors. Someday there will be a better solution
  }
}
