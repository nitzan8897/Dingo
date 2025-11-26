import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RatingVector {
  @Field(() => Int)
  professionalism: number;

  @Field(() => Int)
  availability: number;

  @Field(() => Int)
  empathy: number;

  @Field(() => Int)
  cost: number;
}
