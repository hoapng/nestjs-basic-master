import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { USER_ROLE } from 'src/databases/sample';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { RolesService } from 'src/roles/roles.service';
import { use } from 'passport';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,

    private jwtService: JwtService,

    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    private configService: ConfigService,

    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,

    private roleService: RolesService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.roleService.findOne(userRole._id);
        const objUser = {
          ...user.toObject(),
          permissions: temp?.permissions ?? [],
        };
        return objUser;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role, permissions } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };

    const refresh_token = this.createRefreshToken(payload);

    //update refresh token
    await this.usersService.updateUserToken(_id, refresh_token);

    // set cookie
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role,
      permissions,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    //check email exist
    const userExist = await this.userModel.findOne({
      email: registerUserDto.email,
    });
    if (userExist) {
      throw new BadRequestException('Email already exist');
    }

    //fetch user role
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    registerUserDto.password = this.usersService.getHashPassword(
      registerUserDto.password,
    );
    let user = await this.userModel.create({
      ...registerUserDto,
      role: userRole?._id,
    });
    return {
      _id: user?._id,
      createdAt: user?.createdAt,
    };
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      let user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { _id, name, email, role } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };

        const refresh_token = this.createRefreshToken(payload);

        //update refresh token
        await this.usersService.updateUserToken(_id.toString(), refresh_token);

        //fetch user role
        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.roleService.findOne(userRole._id);

        // set cookie
        response.clearCookie('refresh_token');

        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          _id,
          name,
          email,
          role,
          permissions: temp?.permissions ?? [],
        };
      }
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  };

  logout = async (user: IUser, response: Response) => {
    response.clearCookie('refresh_token');
    await this.usersService.updateUserToken(user._id, '');
    return 'ok';
  };
}
