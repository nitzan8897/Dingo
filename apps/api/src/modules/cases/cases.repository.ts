import { Injectable } from '@nestjs/common';
import { Case } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { CaseFilterDto } from './dto/case-filter.dto';

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
        pdfUrl: createCaseDto.pdfUrl,
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
        pdfUrl: createCaseDto.pdfUrl,
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

  async findAll(filter?: CaseFilterDto): Promise<Case[]> {
    const where: any = {};

    if (filter?.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { judgeName: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter?.specialty) {
      where.specialty = filter.specialty;
    }

    if (filter?.name) {
      where.title = { contains: filter.name, mode: 'insensitive' };
    }

    if (filter?.status) {
      where.result = filter.status;
    }

    if (filter?.year) {
      where.closedAt = {
        gte: new Date(`${filter.year}-01-01`),
        lt: new Date(`${filter.year + 1}-01-01`),
      };
    }

    return this.prisma.case.findMany({
      where,
      orderBy: { closedAt: 'desc' },
    });
  }
}
