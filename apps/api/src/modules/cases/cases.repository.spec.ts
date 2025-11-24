import { Test, TestingModule } from '@nestjs/testing';
import { CasesRepository } from './cases.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { CaseFilterDto } from './dto/case-filter.dto';

describe('CasesRepository', () => {
  let repository: CasesRepository;
  let prisma: PrismaService;

  const mockPrismaService = {
    case: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CasesRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<CasesRepository>(CasesRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertCase', () => {
    it('should create a new case', async () => {
      const createCaseDto: CreateCaseDto = {
        externalId: '12345-01-24',
        title: 'Test Case',
        specialty: 'CRIMINAL',
        result: 'DEFENCE_WON',
        judgeName: 'Judge Smith',
        pdfUrl: 'https://example.com/case.pdf',
        openedAt: '2024-01-01',
        closedAt: '2024-06-01',
        complexityScore: 0.7,
        rawText: 'Case details...',
        plaintiffLawyerIds: ['lawyer-1'],
        defendantLawyerIds: ['lawyer-2'],
        associatedLawyerIds: [],
      };

      const expectedCase = {
        id: 'case-uuid',
        ...createCaseDto,
        openedAt: new Date('2024-01-01'),
        closedAt: new Date('2024-06-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.case.upsert.mockResolvedValue(expectedCase);

      const result = await repository.upsertCase(createCaseDto);

      expect(result).toEqual(expectedCase);
      expect(prisma.case.upsert).toHaveBeenCalledWith({
        where: { externalId: createCaseDto.externalId },
        update: expect.objectContaining({
          title: createCaseDto.title,
          specialty: createCaseDto.specialty,
          result: createCaseDto.result,
          judgeName: createCaseDto.judgeName,
          pdfUrl: createCaseDto.pdfUrl,
        }),
        create: expect.objectContaining({
          externalId: createCaseDto.externalId,
          title: createCaseDto.title,
          specialty: createCaseDto.specialty,
          result: createCaseDto.result,
        }),
      });
    });

    it('should update an existing case', async () => {
      const createCaseDto: CreateCaseDto = {
        externalId: '12345-01-24',
        title: 'Updated Case Title',
        specialty: 'CIVIL',
        result: 'settlement',
        judgeName: 'Judge Johnson',
        pdfUrl: 'https://example.com/updated-case.pdf',
        complexityScore: 0.8,
        rawText: 'Updated case details...',
        plaintiffLawyerIds: ['lawyer-1'],
        defendantLawyerIds: ['lawyer-2'],
        associatedLawyerIds: ['lawyer-3'],
      };

      const expectedCase = {
        id: 'case-uuid',
        ...createCaseDto,
        openedAt: null,
        closedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.case.upsert.mockResolvedValue(expectedCase);

      const result = await repository.upsertCase(createCaseDto);

      expect(result).toEqual(expectedCase);
      expect(prisma.case.upsert).toHaveBeenCalled();
    });
  });

  describe('findByExternalId', () => {
    it('should find a case by external ID', async () => {
      const externalId = '12345-01-24';
      const expectedCase = {
        id: 'case-uuid',
        externalId,
        title: 'Test Case',
        specialty: 'CRIMINAL',
        result: 'DEFENCE_WON',
        judgeName: 'Judge Smith',
        pdfUrl: 'https://example.com/case.pdf',
        openedAt: new Date('2024-01-01'),
        closedAt: new Date('2024-06-01'),
        complexityScore: 0.7,
        rawText: 'Case details...',
        plaintiffLawyerIds: ['lawyer-1'],
        defendantLawyerIds: ['lawyer-2'],
        associatedLawyerIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.case.findUnique.mockResolvedValue(expectedCase);

      const result = await repository.findByExternalId(externalId);

      expect(result).toEqual(expectedCase);
      expect(prisma.case.findUnique).toHaveBeenCalledWith({
        where: { externalId },
      });
    });

    it('should return null when case is not found', async () => {
      const externalId = 'non-existent-id';

      mockPrismaService.case.findUnique.mockResolvedValue(null);

      const result = await repository.findByExternalId(externalId);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    const mockCases = [
      {
        id: 'case-1',
        externalId: '12345-01-24',
        title: 'Case 1',
        specialty: 'CRIMINAL',
        result: 'DEFENCE_WON',
        judgeName: 'Judge Smith',
        pdfUrl: null,
        openedAt: new Date('2024-01-01'),
        closedAt: new Date('2024-06-01'),
        complexityScore: 0.7,
        rawText: 'Case 1 details',
        plaintiffLawyerIds: [],
        defendantLawyerIds: [],
        associatedLawyerIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'case-2',
        externalId: '67890-02-24',
        title: 'Case 2',
        specialty: 'CIVIL',
        result: 'settlement',
        judgeName: 'Judge Johnson',
        pdfUrl: 'https://example.com/case2.pdf',
        openedAt: new Date('2023-05-01'),
        closedAt: new Date('2023-12-01'),
        complexityScore: 0.5,
        rawText: 'Case 2 details',
        plaintiffLawyerIds: [],
        defendantLawyerIds: [],
        associatedLawyerIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return all cases when no filter is provided', async () => {
      mockPrismaService.case.findMany.mockResolvedValue(mockCases);

      const result = await repository.findAll();

      expect(result).toEqual(mockCases);
      expect(prisma.case.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { closedAt: 'desc' },
      });
    });

    it('should filter cases by search query', async () => {
      const filter: CaseFilterDto = { search: 'Case 1' };
      mockPrismaService.case.findMany.mockResolvedValue([mockCases[0]]);

      const result = await repository.findAll(filter);

      expect(result).toEqual([mockCases[0]]);
      expect(prisma.case.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'Case 1', mode: 'insensitive' } },
            { judgeName: { contains: 'Case 1', mode: 'insensitive' } },
          ],
        },
        orderBy: { closedAt: 'desc' },
      });
    });

    it('should filter cases by specialty', async () => {
      const filter: CaseFilterDto = { specialty: 'CRIMINAL' };
      mockPrismaService.case.findMany.mockResolvedValue([mockCases[0]]);

      const result = await repository.findAll(filter);

      expect(result).toEqual([mockCases[0]]);
      expect(prisma.case.findMany).toHaveBeenCalledWith({
        where: { specialty: 'CRIMINAL' },
        orderBy: { closedAt: 'desc' },
      });
    });

    it('should filter cases by status', async () => {
      const filter: CaseFilterDto = { status: 'DEFENCE_WON' };
      mockPrismaService.case.findMany.mockResolvedValue([mockCases[0]]);

      const result = await repository.findAll(filter);

      expect(result).toEqual([mockCases[0]]);
      expect(prisma.case.findMany).toHaveBeenCalledWith({
        where: { result: 'DEFENCE_WON' },
        orderBy: { closedAt: 'desc' },
      });
    });

    it('should filter cases by year', async () => {
      const filter: CaseFilterDto = { year: 2024 };
      mockPrismaService.case.findMany.mockResolvedValue([mockCases[0]]);

      const result = await repository.findAll(filter);

      expect(result).toEqual([mockCases[0]]);
      expect(prisma.case.findMany).toHaveBeenCalledWith({
        where: {
          closedAt: {
            gte: new Date('2024-01-01'),
            lt: new Date('2025-01-01'),
          },
        },
        orderBy: { closedAt: 'desc' },
      });
    });

    it('should apply multiple filters simultaneously', async () => {
      const filter: CaseFilterDto = {
        specialty: 'CRIMINAL',
        status: 'DEFENCE_WON',
        year: 2024,
      };
      mockPrismaService.case.findMany.mockResolvedValue([mockCases[0]]);

      const result = await repository.findAll(filter);

      expect(result).toEqual([mockCases[0]]);
      expect(prisma.case.findMany).toHaveBeenCalledWith({
        where: {
          specialty: 'CRIMINAL',
          result: 'DEFENCE_WON',
          closedAt: {
            gte: new Date('2024-01-01'),
            lt: new Date('2025-01-01'),
          },
        },
        orderBy: { closedAt: 'desc' },
      });
    });
  });
});
