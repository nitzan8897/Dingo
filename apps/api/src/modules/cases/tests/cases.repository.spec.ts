import { Test, TestingModule } from '@nestjs/testing';
import { CasesRepository } from '../cases.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCaseDto } from '../dto/create-case.dto';

describe('CasesRepository', () => {
  let repository: CasesRepository;
  let prismaService: any;

  const mockPrismaCase = {
    id: 'case-uuid-1',
    externalId: '12345-01-24',
    title: 'Cohen vs. Advanced Construction Ltd.',
    specialty: 'CIVIL',
    result: 'win',
    judgeName: 'Judge David Cohen',
    openedAt: new Date('2024-01-15'),
    closedAt: new Date('2024-06-20'),
    complexityScore: 0.7,
    rawText: 'בית המשפט...',
    plaintiffLawyerIds: ['lawyer-uuid-1'],
    defendantLawyerIds: ['lawyer-uuid-2'],
    associatedLawyerIds: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      case: {
        upsert: jest.fn().mockResolvedValue(mockPrismaCase),
        findUnique: jest.fn().mockResolvedValue(mockPrismaCase),
        findMany: jest.fn().mockResolvedValue([mockPrismaCase]),
      },
    };

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
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertCase', () => {
    const createCaseDto: CreateCaseDto = {
      externalId: '12345-01-24',
      title: 'Cohen vs. Advanced Construction Ltd.',
      specialty: 'CIVIL',
      result: 'win',
      judgeName: 'Judge David Cohen',
      openedAt: '2024-01-15T00:00:00Z',
      closedAt: '2024-06-20T00:00:00Z',
      complexityScore: 0.7,
      rawText: 'בית המשפט...',
      plaintiffLawyerIds: ['lawyer-uuid-1'],
      defendantLawyerIds: ['lawyer-uuid-2'],
      associatedLawyerIds: [],
    };

    it('should create a new case when externalId does not exist', async () => {
      prismaService.case.upsert.mockResolvedValue(mockPrismaCase);

      const result = await repository.upsertCase(createCaseDto);

      expect(prismaService.case.upsert).toHaveBeenCalledWith({
        where: { externalId: createCaseDto.externalId },
        update: expect.objectContaining({
          title: createCaseDto.title,
          specialty: createCaseDto.specialty,
          result: createCaseDto.result,
        }),
        create: expect.objectContaining({
          externalId: createCaseDto.externalId,
          title: createCaseDto.title,
          specialty: createCaseDto.specialty,
          result: createCaseDto.result,
        }),
      });
      expect(result).toEqual(mockPrismaCase);
    });

    it('should update existing case when externalId exists', async () => {
      const updatedCase = { ...mockPrismaCase, title: 'Updated Title' };
      prismaService.case.upsert.mockResolvedValue(updatedCase);

      const result = await repository.upsertCase({
        ...createCaseDto,
        title: 'Updated Title',
      });

      expect(prismaService.case.upsert).toHaveBeenCalled();
      expect(result.title).toBe('Updated Title');
    });

    it('should handle optional fields correctly', async () => {
      const dtoWithoutOptionals: CreateCaseDto = {
        externalId: '12345-01-24',
        title: 'Test Case',
        specialty: 'CIVIL',
        result: 'win',
        complexityScore: 0.5,
        rawText: 'Test text',
        plaintiffLawyerIds: [],
        defendantLawyerIds: [],
        associatedLawyerIds: [],
      };

      prismaService.case.upsert.mockResolvedValue({
        ...mockPrismaCase,
        judgeName: null,
        openedAt: null,
        closedAt: null,
      });

      await repository.upsertCase(dtoWithoutOptionals);

      expect(prismaService.case.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            judgeName: undefined,
            openedAt: null,
            closedAt: null,
          }),
        })
      );
    });

    it('should convert date strings to Date objects', async () => {
      prismaService.case.upsert.mockResolvedValue(mockPrismaCase);

      await repository.upsertCase(createCaseDto);

      const upsertCall = prismaService.case.upsert.mock.calls[0][0];
      expect(upsertCall.create.openedAt).toBeInstanceOf(Date);
      expect(upsertCall.create.closedAt).toBeInstanceOf(Date);
      expect(upsertCall.update.openedAt).toBeInstanceOf(Date);
      expect(upsertCall.update.closedAt).toBeInstanceOf(Date);
    });

    it('should handle all lawyer ID arrays correctly', async () => {
      const dtoWithAllLawyers: CreateCaseDto = {
        ...createCaseDto,
        plaintiffLawyerIds: ['lawyer-1', 'lawyer-2'],
        defendantLawyerIds: ['lawyer-3', 'lawyer-4'],
        associatedLawyerIds: ['lawyer-5'],
      };

      prismaService.case.upsert.mockResolvedValue(mockPrismaCase);

      await repository.upsertCase(dtoWithAllLawyers);

      expect(prismaService.case.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            plaintiffLawyerIds: ['lawyer-1', 'lawyer-2'],
            defendantLawyerIds: ['lawyer-3', 'lawyer-4'],
            associatedLawyerIds: ['lawyer-5'],
          }),
        })
      );
    });
  });

  describe('findByExternalId', () => {
    it('should return a case when found', async () => {
      prismaService.case.findUnique.mockResolvedValue(mockPrismaCase);

      const result = await repository.findByExternalId('12345-01-24');

      expect(prismaService.case.findUnique).toHaveBeenCalledWith({
        where: { externalId: '12345-01-24' },
      });
      expect(result).toEqual(mockPrismaCase);
    });

    it('should return null when case not found', async () => {
      prismaService.case.findUnique.mockResolvedValue(null);

      const result = await repository.findByExternalId('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all cases ordered by closedAt desc', async () => {
      const mockCases = [
        mockPrismaCase,
        {
          ...mockPrismaCase,
          id: 'case-uuid-2',
          closedAt: new Date('2024-05-20'),
        },
      ];

      prismaService.case.findMany.mockResolvedValue(mockCases);

      const result = await repository.findAll();

      expect(prismaService.case.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { closedAt: 'desc' },
      });
      expect(result).toEqual(mockCases);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no cases exist', async () => {
      prismaService.case.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });
});
