import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  Res,
} from '@nestjs/common';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @ResponseMessage('Register user successfully')
  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Public()
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
