import { Injectable } from '@nestjs/common';
import { Policy } from './interface/policy.interface';
import { DeleteResourcePolicy } from './policies/delete-resource.policy';

@Injectable()
export class PolicyFactory {
  createPolicy(action: string, user: any, resource: any): Policy {
    switch (action) {
      case 'delete':
        return new DeleteResourcePolicy(user, resource);
      default:
        throw new Error(`No policy found for action: ${action}`);
    }
  }
}
