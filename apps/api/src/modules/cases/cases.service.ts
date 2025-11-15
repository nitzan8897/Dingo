import { Injectable, BadRequestException } from '@nestjs/common';
import { Case } from '@prisma/client';
import { CasesRepository } from './cases.repository';
import { CreateCaseDto } from './dto/create-case.dto';
import { LawyersRepository } from '../lawyers/lawyers.repository';

@Injectable()
export class CasesService {
  constructor(
    private readonly casesRepository: CasesRepository,
    private readonly lawyersRepository: LawyersRepository,
  ) {}

  async upsertCase(createCaseDto: CreateCaseDto): Promise<Case> {
    // Validate all lawyer IDs exist
    await this.validateLawyerIds(createCaseDto);

    return this.casesRepository.upsertCase(createCaseDto);
  }

  private async validateLawyerIds(createCaseDto: CreateCaseDto): Promise<void> {
    // Collect all unique lawyer IDs from all three arrays
    const allLawyerIds = new Set<string>([
      ...createCaseDto.plaintiffLawyerIds,
      ...createCaseDto.defendantLawyerIds,
      ...createCaseDto.associatedLawyerIds,
    ]);

    if (allLawyerIds.size === 0) {
      // No lawyers to validate - this is acceptable
      return;
    }

    // Check each lawyer ID exists in the database
    const invalidLawyerIds: string[] = [];

    for (const lawyerId of allLawyerIds) {
      const lawyer = await this.lawyersRepository.findById(lawyerId);
      if (!lawyer) {
        invalidLawyerIds.push(lawyerId);
      }
    }

    if (invalidLawyerIds.length > 0) {
      throw new BadRequestException(
        `The following lawyer IDs do not exist: ${invalidLawyerIds.join(', ')}`
      );
    }
  }

  async findByExternalId(externalId: string): Promise<Case | null> {
    return this.casesRepository.findByExternalId(externalId);
  }

  async findAll(): Promise<Case[]> {
    return this.casesRepository.findAll();
  }
}
