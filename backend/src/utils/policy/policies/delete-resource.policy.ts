import { Policy } from '../interface/policy.interface';

export class DeleteResourcePolicy implements Policy {
  constructor(private user: any, private resource: any) {}

  actionAllowed(): boolean {
    // Only allow deleting a resource if the user owns it or is an admin
    return this.user.id === this.resource.ownerId;
  }
}