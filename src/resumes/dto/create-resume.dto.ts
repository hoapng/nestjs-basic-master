import { IsMongoId, IsNotEmpty } from 'class-validator';
import e from 'express';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'User ID is required' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'URL is required' })
  url: string;

  @IsNotEmpty({ message: 'Status is required' })
  status: string;

  @IsNotEmpty({ message: 'Company ID is required' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Job ID is required' })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'URL is required' })
  url: string;

  @IsNotEmpty({ message: 'Company ID is required' })
  @IsMongoId({ message: 'Company ID is invalid' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Job ID is required' })
  @IsMongoId({ message: 'Job ID is invalid' })
  jobId: mongoose.Schema.Types.ObjectId;
}
