import { Injectable } from '@nestjs/common';
import { Case } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';

@Injectable()
export class CasesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertCase(createCaseDto: CreateCaseDto): Promise<Case> {
    return this.prisma.case.upsert({
      where: { externalId: createCaseDto.externalId },
      update: {
        title: createCaseDto.title,
        specialty: createCaseDto.specialty,
        result: createCaseDto.result,
        judgeName: createCaseDto.judgeName,
        openedAt: createCaseDto.openedAt ? new Date(createCaseDto.openedAt) : null,
        closedAt: createCaseDto.closedAt ? new Date(createCaseDto.closedAt) : null,
        complexityScore: createCaseDto.complexityScore,
        rawText: createCaseDto.rawText,
        plaintiffLawyerIds: createCaseDto.plaintiffLawyerIds,
        defendantLawyerIds: createCaseDto.defendantLawyerIds,
        associatedLawyerIds: createCaseDto.associatedLawyerIds,
        updatedAt: new Date(),
      },
      create: {
        externalId: createCaseDto.externalId,
        title: createCaseDto.title,
        specialty: createCaseDto.specialty,
        result: createCaseDto.result,
        judgeName: createCaseDto.judgeName,
        openedAt: createCaseDto.openedAt ? new Date(createCaseDto.openedAt) : null,
        closedAt: createCaseDto.closedAt ? new Date(createCaseDto.closedAt) : null,
        complexityScore: createCaseDto.complexityScore,
        rawText: createCaseDto.rawText,
        plaintiffLawyerIds: createCaseDto.plaintiffLawyerIds,
        defendantLawyerIds: createCaseDto.defendantLawyerIds,
        associatedLawyerIds: createCaseDto.associatedLawyerIds,
      },
    });
  }

  async findByExternalId(externalId: string): Promise<Case | null> {
    return this.prisma.case.findUnique({
      where: { externalId },
    });
  }

  async findAll(): Promise<Case[]> {
    return this.prisma.case.findMany({
      orderBy: { closedAt: 'desc' },
    });
  }
}
