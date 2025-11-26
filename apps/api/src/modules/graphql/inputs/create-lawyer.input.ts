import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

@InputType()
class RatingVectorInput {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(100)
  professionalism: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(100)
  availability: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(100)
  empathy: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(100)
  cost: number;
}

@InputType()
export class CreateLawyerInput {
  @Field()
  @IsString()
  fullNameEn: string;

  @Field()
  @IsString()
  fullNameHe: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bioEn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bioHe?: string;

  @Field()
  @IsString()
  cityId: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  specialties: string[];

  @Field(() => Int)
  @IsInt()
  @Min(0)
  yearsOfExperience: number;

  @Field(() => RatingVectorInput)
  @ValidateNested()
  @Type(() => RatingVectorInput)
  ratingVector: RatingVectorInput;
}
