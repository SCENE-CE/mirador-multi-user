import { Project } from '../../../BaseEntities/project/entities/project.entity';
import { User } from '../../../BaseEntities/users/entities/user.entity';
import {
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../enum/Action';
// import { LinkGroupProjectService } from '../../../LinkModules/link-group-project/link-group-project.service';

type Subjects = InferSubjects<typeof Project | typeof User> | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;
// const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;
@Injectable()
export class CaslAbilityFactory {
  constructor(
    // private readonly linkGroupProjectService: LinkGroupProjectService,
  ) {}
  // defineAbilityForUser(user) {
  //   const { can, build } = new AbilityBuilder<PureAbility<[Action, Subjects]>>(
  //     PureAbility as AbilityClass<AppAbility>,
  //   );
  //
  //
  //   const userCanAccessProjects = await this.linkGroupProjectService.groupHasAccesToProject(user.id, 1);
  //
  //   if (userCanAccessProjects) {
  //     can(Action.Read, Project, { ownerId: user.sub });
  //     can(Action.Update, Project, { ownerId: user.sub });
  //     can(Action.Delete, Project, { ownerId: user.sub });
  //   }
  //
  //   return build({ conditionsMatcher: lambdaMatcher });
  // }
}
