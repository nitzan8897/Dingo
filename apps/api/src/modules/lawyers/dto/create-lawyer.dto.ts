import {
  IsString,
  IsArray,
  IsInt,
  IsObject,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Rating vector validation
 */
class RatingVectorDto {
  @IsInt()
  @Min(0)
  @Max(100)
  professionalism: number;

  @IsInt()
  @Min(0)
  @Max(100)
  availability: number;

  @IsInt()
  @Min(0)
  @Max(100)
  empathy: number;

  @IsInt()
  @Min(0)
  @Max(100)
  cost: number;
}

/**
 * Create lawyer DTO
 * Data Transfer Object with validation
 */
export class CreateLawyerDto {
  @IsString()
  fullNameEn: string;

  @IsString()
  fullNameHe: string;

  @IsString()
  city: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  specialties: string[];

  @IsInt()
  @Min(0)
  yearsOfExperience: number;

  @IsObject()
  @ValidateNested()
  @Type(() => RatingVectorDto)
  ratingVector: RatingVectorDto;
}
