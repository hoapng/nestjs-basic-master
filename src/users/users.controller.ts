import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, UserDecor } from 'src/decorator/customize';
import { IUser } from './user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create user successfully')
  create(@Body() createUserDto: CreateUserDto, @UserDecor() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ResponseMessage('Get all users successfully with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Get user successfully')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage('Update user successfully')
  update(@Body() updateUserDto: UpdateUserDto, @UserDecor() user: IUser) {
    return this.usersService.update(updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete user successfully')
  remove(@Param('id') id: string, @UserDecor() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
