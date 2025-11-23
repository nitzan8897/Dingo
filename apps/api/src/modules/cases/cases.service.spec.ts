import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CasesRepository } from './cases.repository';
import { LawyersRepository } from '../lawyers/lawyers.repository';
import { CreateCaseDto } from './dto/create-case.dto';
import { CaseFilterDto } from './dto/case-filter.dto';

describe('CasesService', () => {
  let service: CasesService;
  let casesRepository: CasesRepository;
  let lawyersRepository: LawyersRepository;

  const mockCasesRepository = {
    upsertCase: jest.fn(),
    findByExternalId: jest.fn(),
    findAll: jest.fn(),
  };

  const mockLawyersRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CasesService,
        {
          provide: CasesRepository,
          useValue: mockCasesRepository,
        },
        {
          provide: LawyersRepository,
          useValue: mockLawyersRepository,
        },
      ],
    }).compile();

    service = module.get<CasesService>(CasesService);
    casesRepository = module.get<CasesRepository>(CasesRepository);
    lawyersRepository = module.get<LawyersRepository>(LawyersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertCase', () => {
    const validCaseDto: CreateCaseDto = {
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

    it('should successfully upsert a case with valid lawyer IDs', async () => {
      const expectedCase = {
        id: 'case-uuid',
        ...validCaseDto,
        openedAt: null,
        closedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockLawyersRepository.findById
        .mockResolvedValueOnce({ id: 'lawyer-1' })
        .mockResolvedValueOnce({ id: 'lawyer-2' });

      mockCasesRepository.upsertCase.mockResolvedValue(expectedCase);

      const result = await service.upsertCase(validCaseDto);

      expect(result).toEqual(expectedCase);
      expect(lawyersRepository.findById).toHaveBeenCalledTimes(2);
      expect(lawyersRepository.findById).toHaveBeenCalledWith('lawyer-1');
      expect(lawyersRepository.findById).toHaveBeenCalledWith('lawyer-2');
      expect(casesRepository.upsertCase).toHaveBeenCalledWith(validCaseDto);
    });

    it('should throw BadRequestException when a lawyer ID does not exist', async () => {
      mockLawyersRepository.findById
        .mockResolvedValueOnce({ id: 'lawyer-1' })
        .mockResolvedValueOnce(null);

      await expect(service.upsertCase(validCaseDto)).rejects.toThrow(
        BadRequestException
      );

      expect(lawyersRepository.findById).toHaveBeenCalledTimes(2);
      expect(casesRepository.upsertCase).not.toHaveBeenCalled();
    });

    it('should succeed when case has no associated lawyers', async () => {
      const caseWithNoLawyers: CreateCaseDto = {
        ...validCaseDto,
        plaintiffLawyerIds: [],
        defendantLawyerIds: [],
        associatedLawyerIds: [],
      };

      const expectedCase = {
        id: 'case-uuid',
        ...caseWithNoLawyers,
        openedAt: null,
        closedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCasesRepository.upsertCase.mockResolvedValue(expectedCase);

      const result = await service.upsertCase(caseWithNoLawyers);

      expect(result).toEqual(expectedCase);
      expect(lawyersRepository.findById).not.toHaveBeenCalled();
      expect(casesRepository.upsertCase).toHaveBeenCalledWith(caseWithNoLawyers);
    });

    it('should validate all unique lawyer IDs from all arrays', async () => {
      const caseWithMultipleLawyers: CreateCaseDto = {
        ...validCaseDto,
        plaintiffLawyerIds: ['lawyer-1', 'lawyer-2'],
        defendantLawyerIds: ['lawyer-3'],
        associatedLawyerIds: ['lawyer-4', 'lawyer-1'],
      };

      mockLawyersRepository.findById
        .mockResolvedValueOnce({ id: 'lawyer-1' })
        .mockResolvedValueOnce({ id: 'lawyer-2' })
        .mockResolvedValueOnce({ id: 'lawyer-3' })
        .mockResolvedValueOnce({ id: 'lawyer-4' });

      const expectedCase = {
        id: 'case-uuid',
        ...caseWithMultipleLawyers,
        openedAt: null,
        closedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCasesRepository.upsertCase.mockResolvedValue(expectedCase);

      const result = await service.upsertCase(caseWithMultipleLawyers);

      expect(result).toEqual(expectedCase);
      expect(lawyersRepository.findById).toHaveBeenCalledTimes(4);
    });
  });

  describe('findByExternalId', () => {
    it('should return a case when found', async () => {
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
        plaintiffLawyerIds: ['lawyer-1'],
        defendantLawyerIds: ['lawyer-2'],
        associatedLawyerIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCasesRepository.findByExternalId.mockResolvedValue(expectedCase);

      const result = await service.findByExternalId(externalId);

      expect(result).toEqual(expectedCase);
      expect(casesRepository.findByExternalId).toHaveBeenCalledWith(externalId);
    });

    it('should return null when case is not found', async () => {
      const externalId = 'non-existent';

      mockCasesRepository.findByExternalId.mockResolvedValue(null);

      const result = await service.findByExternalId(externalId);

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
      mockCasesRepository.findAll.mockResolvedValue(mockCases);

      const result = await service.findAll();

      expect(result).toEqual(mockCases);
      expect(casesRepository.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should pass filters to repository', async () => {
      const filter: CaseFilterDto = {
        search: 'test',
        specialty: 'CRIMINAL',
        status: 'win',
        year: 2024,
      };

      mockCasesRepository.findAll.mockResolvedValue([mockCases[0]]);

      const result = await service.findAll(filter);

      expect(result).toEqual([mockCases[0]]);
      expect(casesRepository.findAll).toHaveBeenCalledWith(filter);
    });
  });
});
