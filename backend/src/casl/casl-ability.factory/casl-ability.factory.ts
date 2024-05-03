import { Project } from '../../project/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import {
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../enum/Action';

type Subjects = InferSubjects<typeof Project | typeof User> | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;

// @Injectable()
// export class CaslAbilityFactory {
//   defineAbilityForUser(user: User) {
//     const { can } = new AbilityBuilder<PureAbility<[Action, Subjects]>>(
//       PureAbility as AbilityClass<AppAbility>,
//     );
//
//     can(Action.Manage, Project, { ownerId: user.id });
//   }
// }
