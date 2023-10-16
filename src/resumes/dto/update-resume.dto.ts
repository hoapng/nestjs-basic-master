import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateResumeDto } from './create-resume.dto';

export class UpdateResumeDto extends PartialType(CreateResumeDto) {}

export class UpdateUserCvDto {
  @IsNotEmpty({ message: 'Status is required' })
  status: string;
}
