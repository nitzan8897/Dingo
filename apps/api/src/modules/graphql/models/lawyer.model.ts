import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { City } from './city.model';
import { RatingVector } from './rating-vector.model';
import { Review } from './review.model';

@ObjectType()
export class Lawyer {
  @Field(() => ID)
  id: string;

  @Field()
  fullNameEn: string;

  @Field()
  fullNameHe: string;

  @Field({ nullable: true })
  bioEn?: string;

  @Field({ nullable: true })
  bioHe?: string;

  @Field()
  cityId: string;

  @Field(() => City)
  city: City;

  @Field(() => [String])
  specialties: string[];

  @Field(() => Int)
  yearsOfExperience: number;

  @Field(() => RatingVector)
  ratingVector: RatingVector;

  @Field(() => [String], { nullable: true })
  caseIds?: string[];

  @Field(() => [Review], { nullable: true })
  reviews?: Review[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
