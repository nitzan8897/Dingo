import { IsOptional, IsString, IsInt, Min, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

/**
 * Lawyer filter DTO
 * Used for query parameters
 */
export class LawyerFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    return value;
  })
  specialties?: string[];

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
