import { Test, TestingModule } from '@nestjs/testing';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { CaseFilterDto } from './dto/case-filter.dto';

describe('CasesController', () => {
  let controller: CasesController;
  let service: CasesService;

  const mockCasesService = {
    upsertCase: jest.fn(),
    findByExternalId: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CasesController],
      providers: [
        {
          provide: CasesService,
          useValue: mockCasesService,
        },
      ],
    }).compile();

    controller = module.get<CasesController>(CasesController);
    service = module.get<CasesService>(CasesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertCase', () => {
    it('should create or update a case', async () => {
      const createCaseDto: CreateCaseDto = {
        externalId: '12345-01-24',
        title: 'Test Case',
        specialty: 'CRIMINAL',
        result: 'win',
        judgeName: 'Judge Smith',
        pdfUrl: 'https://example.com/case.pdf',
        complexityScore: 0.7,
        rawText: 'Case details...',
        plaintiffLawyerIds: ['lawyer-1'],
        defendantLawyerIds: ['lawyer-2'],
        associatedLawyerIds: [],
      };

      const expectedCase = {
        id: 'case-uuid',
        ...createCaseDto,
        openedAt: null,
        closedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCasesService.upsertCase.mockResolvedValue(expectedCase);

      const result = await controller.upsertCase(createCaseDto);

      expect(result).toEqual(expectedCase);
      expect(service.upsertCase).toHaveBeenCalledWith(createCaseDto);
    });
  });

  describe('findAll', () => {
    const mockCases = [
      {
        id: 'case-1',
        externalId: '12345-01-24',
        title: 'Case 1',
        specialty: 'CRIMINAL',
        result: 'win',
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
    ];

    it('should return all cases without filters', async () => {
      const emptyFilter = new CaseFilterDto();
      mockCasesService.findAll.mockResolvedValue(mockCases);

      const result = await controller.findAll(emptyFilter);

      expect(result).toEqual(mockCases);
      expect(service.findAll).toHaveBeenCalledWith(emptyFilter);
    });

    it('should return filtered cases', async () => {
      const filter: CaseFilterDto = {
        search: 'test',
        specialty: 'CRIMINAL',
        status: 'win',
        year: 2024,
      };

      mockCasesService.findAll.mockResolvedValue(mockCases);

      const result = await controller.findAll(filter);

      expect(result).toEqual(mockCases);
      expect(service.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('findByExternalId', () => {
    it('should return a case by external ID', async () => {
      const externalId = '12345-01-24';
      const expectedCase = {
        id: 'case-uuid',
        externalId,
        title: 'Test Case',
        specialty: 'CRIMINAL',
        result: 'win',
        judgeName: 'Judge Smith',
        pdfUrl: 'https://example.com/case.pdf',
        openedAt: new Date('2024-01-01'),
        closedAt: new Date('2024-06-01'),
        complexityScore: 0.7,
        rawText: 'Case details...',
        plaintiffLawyerIds: [],
        defendantLawyerIds: [],
        associatedLawyerIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCasesService.findByExternalId.mockResolvedValue(expectedCase);

      const result = await controller.findByExternalId(externalId);

      expect(result).toEqual(expectedCase);
      expect(service.findByExternalId).toHaveBeenCalledWith(externalId);
    });

    it('should return null when case is not found', async () => {
      const externalId = 'non-existent';

      mockCasesService.findByExternalId.mockResolvedValue(null);

      const result = await controller.findByExternalId(externalId);

      expect(result).toBeNull();
    });
  });
});
