import { IsNotEmpty, IsNumberString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class FindOneParams {
  @IsNotEmpty()
  @IsNumberString()
  id: number;
}

export class FindAllParams {
  @IsNumberString()
  @IsNotEmpty()
  owner: User;
}

export class PatchParams {
  @IsNumberString()
  @IsNotEmpty()
  id: number;
}

export class DeleteParams {
  @IsNumberString()
  @IsNotEmpty()
  id: number;
}
