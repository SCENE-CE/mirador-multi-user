// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import {
//   AppAbility,
//   CaslAbilityFactory,
// } from './casl-ability.factory/casl-ability.factory';
// import { PolicyHandler } from './Interface/IpolicyHandler';
// import { CHECK_POLICIES_KEY } from './decorators/CheckPolicies';

// @Injectable()
// export class PoliciesGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private caslAbilityFactory: CaslAbilityFactory,
//   ) {}
  // async canActivate(context: ExecutionContext){
  // console.log('Enter can activate')
  // const policyHandlers =
  //   this.reflector.get<PolicyHandler[]>(
  //     CHECK_POLICIES_KEY,
  //     context.getHandler(),
  //   ) || [];
  // console.log(context.switchToHttp().getRequest().user);
  // const { user } = context.switchToHttp().getRequest();
  // const ability = this.caslAbilityFactory.defineAbilityForUser(user);
  //
  // const test = policyHandlers.every((handler) =>
  //   this.execPolicyHandler(handler, ability),
  // );
  // console.log("test")
  // console.log(test)
  // return test;
  // }

//   private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
//     if (typeof handler === 'function') {
//       return handler(ability);
//     }
//     return handler.handle(ability);
//   }
// }
