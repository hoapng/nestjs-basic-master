import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsNotEmpty({ message: 'Age is required' })
  age: number;

  @IsNotEmpty({ message: 'Gender is required' })
  gender: string;

  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsMongoId({ message: 'Role is invalid' })
  role: mongoose.Schema.Types.ObjectId;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsNotEmpty({ message: 'Age is required' })
  age: number;

  @IsNotEmpty({ message: 'Gender is required' })
  gender: string;

  @IsNotEmpty({ message: 'Address is required' })
  address: string;
}
