import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CasesService } from '../../cases/cases.service';
import { CaseFilterInput } from '../inputs/case-filter.input';
import { CreateCaseInput } from '../inputs/create-case.input';
import { Case } from '../models/case.model';

@Resolver(() => Case)
export class CasesResolver {
  constructor(private readonly casesService: CasesService) {}

  @Query(() => [Case], { name: 'cases' })
  async findAll(
    @Args('filter', { type: () => CaseFilterInput, nullable: true })
    filter?: CaseFilterInput,
  ): Promise<Case[]> {
    return this.casesService.findAll(filter as any || {});
  }

  @Query(() => Case, { name: 'case', nullable: true })
  async findOne(@Args('externalId') externalId: string): Promise<Case | null> {
    return this.casesService.findByExternalId(externalId);
  }

  @Mutation(() => Case)
  async createCase(@Args('input') input: CreateCaseInput): Promise<Case> {
    return this.casesService.upsertCase(input as any);
  }
}
