import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNotEmpty({ message: 'Active is required' })
  @IsBoolean({ message: 'Active must be boolean' })
  isActive: boolean;

  @IsNotEmpty({ message: 'Permissions is required' })
  @IsMongoId({
    each: true,
    message: 'Permissions must be an array of ObjectId',
  })
  @IsArray({ message: 'Permissions must be an array of ObjectId' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
