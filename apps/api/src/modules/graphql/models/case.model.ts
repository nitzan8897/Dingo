import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Case {
  @Field(() => ID)
  id: string;

  @Field()
  externalId: string;

  @Field()
  title: string;

  @Field()
  specialty: string;

  @Field()
  result: string;

  @Field({ nullable: true })
  judgeName?: string;

  @Field({ nullable: true })
  pdfUrl?: string;

  @Field({ nullable: true })
  openedAt?: Date;

  @Field({ nullable: true })
  closedAt?: Date;

  @Field(() => Float)
  complexityScore: number;

  @Field()
  rawText: string;

  @Field(() => [String])
  plaintiffLawyerIds: string[];

  @Field(() => [String])
  defendantLawyerIds: string[];

  @Field(() => [String])
  associatedLawyerIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
