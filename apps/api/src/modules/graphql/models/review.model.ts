import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Review {
  @Field(() => ID)
  id: string;

  @Field()
  lawyerId: string;

  @Field()
  reviewerName: string;

  @Field(() => Int)
  rating: number;

  @Field()
  commentEn: string;

  @Field()
  commentHe: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
