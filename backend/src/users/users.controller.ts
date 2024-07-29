import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode, UseGuards
} from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteParams, UpdateParams } from './validators/validators';
import { AuthGuard } from "../auth/auth.guard";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Get('groups/:userId')
  @UseGuards(AuthGuard)
  findAllGroups(@Param('userId') userId: number) {
    return this.usersService.getUserGroupsByUserId(userId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param() params: UpdateParams, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(params.id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ transform: true }))
  remove(@Param() params: DeleteParams) {
    return this.usersService.remove(params.id);
  }
}
