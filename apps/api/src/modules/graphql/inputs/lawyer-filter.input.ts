import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

@InputType()
export class LawyerFilterInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  specialties?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  minYearsOfExperience?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  minRating?: number;
}
