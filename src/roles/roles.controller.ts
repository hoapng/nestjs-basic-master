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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, UserDecor } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Create role successfully')
  create(@Body() createRoleDto: CreateRoleDto, @UserDecor() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage('Get all roles successfully with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.rolesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get role by id successfully')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update role successfully')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @UserDecor() user: IUser,
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete role successfully')
  remove(@Param('id') id: string, @UserDecor() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
