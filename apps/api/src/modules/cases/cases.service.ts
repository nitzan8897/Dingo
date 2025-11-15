import { Injectable } from '@nestjs/common';
import { Case } from '@prisma/client';
import { CasesRepository } from './cases.repository';
import { CreateCaseDto } from './dto/create-case.dto';

@Injectable()
export class CasesService {
  constructor(private readonly casesRepository: CasesRepository) {}

  async upsertCase(createCaseDto: CreateCaseDto): Promise<Case> {
    return this.casesRepository.upsertCase(createCaseDto);
  }

  async findByExternalId(externalId: string): Promise<Case | null> {
    return this.casesRepository.findByExternalId(externalId);
  }

  async findAll(): Promise<Case[]> {
    return this.casesRepository.findAll();
  }
}
