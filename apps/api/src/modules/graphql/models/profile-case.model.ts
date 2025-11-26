import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CaseOutcome } from '@prisma/client';

registerEnumType(CaseOutcome, {
  name: 'CaseOutcome',
  description: 'The outcome of a profile case',
});

@ObjectType()
export class ProfileCase {
  @Field(() => ID)
  id: string;

  @Field()
  lawyerId: string;

  @Field()
  titleEn: string;

  @Field()
  titleHe: string;

  @Field()
  descriptionEn: string;

  @Field()
  descriptionHe: string;

  @Field(() => CaseOutcome)
  outcome: CaseOutcome;

  @Field(() => Int)
  year: number;

  @Field()
  isFeatured: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
