import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateCaseInput {
  @Field()
  @IsString()
  externalId: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  specialty: string;

  @Field()
  @IsString()
  result: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  judgeName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  openedAt?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  closedAt?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  @Max(1)
  complexityScore: number;

  @Field()
  @IsString()
  rawText: string;

  @Field(() => [String])
  @IsArray()
  plaintiffLawyerIds: string[];

  @Field(() => [String])
  @IsArray()
  defendantLawyerIds: string[];

  @Field(() => [String])
  @IsArray()
  associatedLawyerIds: string[];
}
