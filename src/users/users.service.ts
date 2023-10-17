import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto, user: IUser) {
    //check email exist
    // const userExist = await this.userModel.findOne({
    //   email: registerUserDto.email,
    // });
    // if (userExist) {
    //   throw new BadRequestException('Email already exist');
    // }

    createUserDto.password = this.getHashPassword(createUserDto.password);
    let newUser = await this.userModel.create({
      ...createUserDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newUser._id,
      createdAt: newUser?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found user');
    }

    return await this.userModel
      .findOne({ _id: id })
      .select('-password')
      .populate({ path: 'role', select: { name: 1, _id: 1 } });
  }

  async findOneByUsername(username: string) {
    return await this.userModel
      .findOne({ email: username })
      .populate({ path: 'role', select: { name: 1, permission: 1 } });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(updateUserDto._id)) {
      throw new BadRequestException('not found user');
    }
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found user');
    }

    const foundUser = await this.userModel.findOne({ _id: id });
    if (foundUser.email === 'admin@gmail.com')
      throw new BadRequestException('Can not delete admin');

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.userModel.softDelete({ _id: id });
  }

  async updateUserToken(_id: string, refreshToken: string) {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  }

  async findUserByToken(refreshToken: string) {
    return await this.userModel.findOne({ refreshToken });
  }
}
