import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Lawyer filter DTO
 * Used for query parameters
 */
export class LawyerFilterDto {
  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minYearsOfExperience?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  minRating?: number;
}

function Max(arg0: number): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {};
}
