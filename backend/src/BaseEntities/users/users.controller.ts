import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // this actions should only be possible if you are the super Admin of the platform, for now I disable this routes
  //
  // @UseGuards(AuthGuard)
  // @Get(':id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // findOne(@Param('id') id: number) {
  //   return this.usersService.findOne(id);
  // }
  // //
  // // @Get('groups/:userId')
  // // @UseGuards(AuthGuard)
  // // findAllGroups(@Param('userId') userId: number) {
  // //   return this.usersService.getUserGroupsByUserId(userId);
  // // }
  // @UseGuards(AuthGuard)
  // @Patch(':id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // update(@Param() params: UpdateParams, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(params.id, updateUserDto);
  // }
  //
  // @UseGuards(AuthGuard)
  // @Delete(':id')
  // @HttpCode(204)
  // @UsePipes(new ValidationPipe({ transform: true }))
  // remove(@Param() params: DeleteParams) {
  //   return this.usersService.remove(params.id);
  // }
}
