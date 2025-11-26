import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LawyersService } from '../../lawyers/lawyers.service';
import { CreateLawyerInput } from '../inputs/create-lawyer.input';
import { LawyerFilterInput } from '../inputs/lawyer-filter.input';
import { City } from '../models/city.model';
import { Lawyer } from '../models/lawyer.model';
import { ProfileCase } from '../models/profile-case.model';
import { Review } from '../models/review.model';
import { PrismaService } from '../../prisma/prisma.service';

@Resolver(() => Lawyer)
export class LawyersResolver {
  constructor(
    private readonly lawyersService: LawyersService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [Lawyer], { name: 'lawyers' })
  async findAll(
    @Args('filter', { type: () => LawyerFilterInput, nullable: true })
    filter?: LawyerFilterInput,
  ): Promise<Lawyer[]> {
    return this.lawyersService.findAll(filter || {}) as any;
  }

  @Query(() => Lawyer, { name: 'lawyer', nullable: true })
  async findOne(@Args('id') id: string): Promise<Lawyer | null> {
    return this.lawyersService.findOne(id) as any;
  }

  @Query(() => [Lawyer], { name: 'searchLawyers' })
  async searchByName(@Args('name') name: string): Promise<Lawyer[]> {
    const result = await this.lawyersService.findByName(name);
    return (Array.isArray(result) ? result : [result]) as any;
  }

  @Mutation(() => Lawyer)
  async createLawyer(
    @Args('input') input: CreateLawyerInput,
  ): Promise<Lawyer> {
    return this.lawyersService.create(input) as any;
  }

  @ResolveField(() => City)
  async city(@Parent() lawyer: Lawyer): Promise<City> {
    return this.prisma.city.findUnique({
      where: { id: lawyer.cityId },
    });
  }

  @ResolveField(() => [ProfileCase])
  async profileCases(@Parent() lawyer: Lawyer): Promise<ProfileCase[]> {
    return this.prisma.profileCase.findMany({
      where: { lawyerId: lawyer.id },
    });
  }

  @ResolveField(() => [Review])
  async reviews(@Parent() lawyer: Lawyer): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { lawyerId: lawyer.id },
    });
  }
}
