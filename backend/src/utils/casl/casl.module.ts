import { forwardRef, Module } from "@nestjs/common";
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { LinkGroupProjectModule } from '../../LinkModules/link-group-project/link-group-project.module';

@Module({
  providers: [CaslAbilityFactory],
  imports: [forwardRef(() => LinkGroupProjectModule)],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
