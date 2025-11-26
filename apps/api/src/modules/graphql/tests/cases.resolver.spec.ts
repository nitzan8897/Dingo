import { Test, TestingModule } from '@nestjs/testing';
import { CasesService } from '../../cases/cases.service';
import { CasesResolver } from '../resolvers/cases.resolver';

describe('CasesResolver', () => {
  let resolver: CasesResolver;
  let casesService: CasesService;

  const mockCase = {
    id: '1',
    externalId: 'ext-123',
    title: 'Criminal Case',
    specialty: 'CRIMINAL',
    result: 'DEFENCE_WON',
    judgeName: 'Judge Smith',
    pdfUrl: 'https://example.com/case.pdf',
    openedAt: new Date('2023-01-01'),
    closedAt: new Date('2023-06-01'),
    complexityScore: 0.75,
    rawText: 'Case details...',
    plaintiffLawyerIds: ['lawyer-1'],
    defendantLawyerIds: ['lawyer-2'],
    associatedLawyerIds: ['lawyer-3'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCasesService = {
    findAll: jest.fn(),
    findByExternalId: jest.fn(),
    upsertCase: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CasesResolver,
        {
          provide: CasesService,
          useValue: mockCasesService,
        },
      ],
    }).compile();

    resolver = module.get<CasesResolver>(CasesResolver);
    casesService = module.get<CasesService>(CasesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cases', async () => {
      mockCasesService.findAll.mockResolvedValue([mockCase]);

      const result = await resolver.findAll();

      expect(result).toEqual([mockCase]);
      expect(casesService.findAll).toHaveBeenCalledWith({});
    });

    it('should apply filters when provided', async () => {
      const filter = { specialty: 'CRIMINAL', year: 2023 };
      mockCasesService.findAll.mockResolvedValue([mockCase]);

      const result = await resolver.findAll(filter);

      expect(result).toEqual([mockCase]);
      expect(casesService.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('findOne', () => {
    it('should return a single case by external ID', async () => {
      mockCasesService.findByExternalId.mockResolvedValue(mockCase);

      const result = await resolver.findOne('ext-123');

      expect(result).toEqual(mockCase);
      expect(casesService.findByExternalId).toHaveBeenCalledWith('ext-123');
    });

    it('should return null if case not found', async () => {
      mockCasesService.findByExternalId.mockResolvedValue(null);

      const result = await resolver.findOne('ext-999');

      expect(result).toBeNull();
      expect(casesService.findByExternalId).toHaveBeenCalledWith('ext-999');
    });
  });

  describe('createCase', () => {
    it('should create or update a case', async () => {
      const input = {
        externalId: 'ext-123',
        title: 'Criminal Case',
        specialty: 'CRIMINAL',
        result: 'DEFENCE_WON',
        judgeName: 'Judge Smith',
        pdfUrl: 'https://example.com/case.pdf',
        openedAt: '2023-01-01',
        closedAt: '2023-06-01',
        complexityScore: 0.75,
        rawText: 'Case details...',
        plaintiffLawyerIds: ['lawyer-1'],
        defendantLawyerIds: ['lawyer-2'],
        associatedLawyerIds: ['lawyer-3'],
      };

      mockCasesService.upsertCase.mockResolvedValue(mockCase);

      const result = await resolver.createCase(input);

      expect(result).toEqual(mockCase);
      expect(casesService.upsertCase).toHaveBeenCalledWith(input);
    });
  });
});
