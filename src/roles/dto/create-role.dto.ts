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

  @IsNotEmpty({ message: 'Module is required' })
  @IsMongoId({ each: true, message: 'Module must be a valid ObjectId' })
  @IsArray({ message: 'Module must be an array' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
