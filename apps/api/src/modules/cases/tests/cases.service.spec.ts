import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CasesService } from '../cases.service';
import { CasesRepository } from '../cases.repository';
import { LawyersRepository } from '../../lawyers/lawyers.repository';
import { CreateCaseDto } from '../dto/create-case.dto';

describe('CasesService', () => {
  let service: CasesService;
  let casesRepository: jest.Mocked<CasesRepository>;
  let lawyersRepository: jest.Mocked<LawyersRepository>;

  const mockCase = {
    id: 'case-uuid-1',
    externalId: '12345-01-24',
    title: 'Cohen vs. Advanced Construction Ltd.',
    specialty: 'CIVIL',
    result: 'DEFENCE_WON' as const,
    judgeName: 'Judge David Cohen',
    openedAt: new Date('2024-01-15'),
    closedAt: new Date('2024-06-20'),
    pdfUrl:'',
    complexityScore: 0.7,
    rawText: 'בית המשפט...',
    plaintiffLawyerIds: ['lawyer-uuid-1'],
    defendantLawyerIds: ['lawyer-uuid-2'],
    associatedLawyerIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLawyer = {
    id: 'lawyer-uuid-1',
    fullNameEn: 'John Doe',
    fullNameHe: 'ג\'ון דו',
    bioEn: 'Bio',
    bioHe: 'ביוגרפיה',
    cityId: 'city-uuid-1',
    specialties: ['CIVIL'],
    yearsOfExperience: 10,
    caseIds: [],
    ratingVector: { professionalism: 0, availability: 0, empathy: 0, cost: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockCasesRepository = {
      upsertCase: jest.fn(),
      findByExternalId: jest.fn(),
      findAll: jest.fn(),
    };

    const mockLawyersRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      createPending: jest.fn(),
      addCaseToLawyer: jest.fn(),
    };

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
    casesRepository = module.get(CasesRepository);
    lawyersRepository = module.get(LawyersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upsertCase', () => {
    const createCaseDto: CreateCaseDto = {
      externalId: '12345-01-24',
      title: 'Cohen vs. Advanced Construction Ltd.',
      specialty: 'CIVIL',
      result: 'DEFENCE_WON',
      judgeName: 'Judge David Cohen',
      openedAt: '2024-01-15T00:00:00Z',
      closedAt: '2024-06-20T00:00:00Z',
      complexityScore: 0.7,
      rawText: 'בית המשפט...',
      plaintiffLawyerIds: ['lawyer-uuid-1'],
      defendantLawyerIds: ['lawyer-uuid-2'],
      associatedLawyerIds: [],
    };

    it('should successfully create a case with valid lawyer IDs', async () => {
      lawyersRepository.findById.mockResolvedValue(mockLawyer);
      casesRepository.upsertCase.mockResolvedValue(mockCase);

      const result = await service.upsertCase(createCaseDto);

      expect(lawyersRepository.findById).toHaveBeenCalledWith('lawyer-uuid-1');
      expect(lawyersRepository.findById).toHaveBeenCalledWith('lawyer-uuid-2');
      expect(lawyersRepository.findById).toHaveBeenCalledTimes(2);
      expect(casesRepository.upsertCase).toHaveBeenCalledWith(createCaseDto);
      expect(result).toEqual(mockCase);
    });

    it('should throw BadRequestException if plaintiff lawyer ID does not exist', async () => {
      lawyersRepository.findById.mockImplementation((id) => {
        if (id === 'lawyer-uuid-1') return Promise.resolve(null);
        return Promise.resolve(mockLawyer);
      });

      await expect(service.upsertCase(createCaseDto)).rejects.toThrow(BadRequestException);
      await expect(service.upsertCase(createCaseDto)).rejects.toThrow(
        'The following lawyer IDs do not exist: lawyer-uuid-1'
      );
      expect(casesRepository.upsertCase).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if defendant lawyer ID does not exist', async () => {
      lawyersRepository.findById.mockImplementation((id) => {
        if (id === 'lawyer-uuid-2') return Promise.resolve(null);
        return Promise.resolve(mockLawyer);
      });

      await expect(service.upsertCase(createCaseDto)).rejects.toThrow(BadRequestException);
      await expect(service.upsertCase(createCaseDto)).rejects.toThrow(
        'The following lawyer IDs do not exist: lawyer-uuid-2'
      );
      expect(casesRepository.upsertCase).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException with multiple invalid lawyer IDs', async () => {
      lawyersRepository.findById.mockResolvedValue(null);

      await expect(service.upsertCase(createCaseDto)).rejects.toThrow(BadRequestException);
      await expect(service.upsertCase(createCaseDto)).rejects.toThrow(
        'The following lawyer IDs do not exist: lawyer-uuid-1, lawyer-uuid-2'
      );
      expect(casesRepository.upsertCase).not.toHaveBeenCalled();
    });

    it('should successfully create a case with associated lawyer IDs', async () => {
      const dtoWithAssociated: CreateCaseDto = {
        ...createCaseDto,
        associatedLawyerIds: ['lawyer-uuid-3'],
      };

      lawyersRepository.findById.mockResolvedValue(mockLawyer);
      casesRepository.upsertCase.mockResolvedValue(mockCase);

      await service.upsertCase(dtoWithAssociated);

      expect(lawyersRepository.findById).toHaveBeenCalledWith('lawyer-uuid-1');
      expect(lawyersRepository.findById).toHaveBeenCalledWith('lawyer-uuid-2');
      expect(lawyersRepository.findById).toHaveBeenCalledWith('lawyer-uuid-3');
      expect(lawyersRepository.findById).toHaveBeenCalledTimes(3);
    });

    it('should successfully create a case with no lawyer IDs', async () => {
      const dtoWithNoLawyers: CreateCaseDto = {
        ...createCaseDto,
        plaintiffLawyerIds: [],
        defendantLawyerIds: [],
        associatedLawyerIds: [],
      };

      casesRepository.upsertCase.mockResolvedValue(mockCase);

      await service.upsertCase(dtoWithNoLawyers);

      expect(lawyersRepository.findById).not.toHaveBeenCalled();
      expect(casesRepository.upsertCase).toHaveBeenCalledWith(dtoWithNoLawyers);
    });

    it('should handle duplicate lawyer IDs across different categories', async () => {
      const dtoWithDuplicates: CreateCaseDto = {
        ...createCaseDto,
        plaintiffLawyerIds: ['lawyer-uuid-1'],
        defendantLawyerIds: ['lawyer-uuid-1'],
        associatedLawyerIds: ['lawyer-uuid-1'],
      };

      lawyersRepository.findById.mockResolvedValue(mockLawyer);
      casesRepository.upsertCase.mockResolvedValue(mockCase);

      await service.upsertCase(dtoWithDuplicates);

      // Should only check unique IDs once
      expect(lawyersRepository.findById).toHaveBeenCalledWith('lawyer-uuid-1');
      expect(lawyersRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByExternalId', () => {
    it('should return a case when found', async () => {
      casesRepository.findByExternalId.mockResolvedValue(mockCase);

      const result = await service.findByExternalId('12345-01-24');

      expect(result).toEqual(mockCase);
      expect(casesRepository.findByExternalId).toHaveBeenCalledWith('12345-01-24');
    });

    it('should return null when case not found', async () => {
      casesRepository.findByExternalId.mockResolvedValue(null);

      const result = await service.findByExternalId('non-existent-id');

      expect(result).toBeNull();
      expect(casesRepository.findByExternalId).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('findAll', () => {
    it('should return all cases', async () => {
      const mockCases = [mockCase, { ...mockCase, id: 'case-uuid-2' }];
      casesRepository.findAll.mockResolvedValue(mockCases);

      const result = await service.findAll();

      expect(result).toEqual(mockCases);
      expect(casesRepository.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no cases exist', async () => {
      casesRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(casesRepository.findAll).toHaveBeenCalled();
    });
  });
});
