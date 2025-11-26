import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class City {
  @Field(() => ID)
  id: string;

  @Field()
  nameEn: string;

  @Field()
  nameHe: string;

  @Field()
  slug: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
