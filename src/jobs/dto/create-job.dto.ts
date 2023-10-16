import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsArray,
  IsString,
  IsDate,
  IsBoolean,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  logo: string;
}
export class CreateJobDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsArray()
  @IsNotEmpty({ message: 'Skills are required' })
  @IsString({ each: true, message: 'Skills must be string' })
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({ message: 'Salary is required' })
  salary: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;

  @IsNotEmpty({ message: 'Level is required' })
  level: string;

  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @IsNotEmpty({ message: 'Start date is required' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Start date must be date' })
  startDate: Date;

  @IsNotEmpty({ message: 'End date is required' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'End date must be date' })
  endDate: Date;

  @IsNotEmpty({ message: 'isActive are required' })
  @IsBoolean({ message: 'isActive must be boolean' })
  isActive: boolean;
}
