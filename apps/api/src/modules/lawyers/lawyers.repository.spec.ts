import { Test, TestingModule } from '@nestjs/testing';
import { LawyersRepository } from './lawyers.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLawyerDto } from './dto/create-lawyer.dto';
import { LawyerFilterDto } from './dto/lawyer-filter.dto';

describe('LawyersRepository', () => {
  let repository: LawyersRepository;
  let prisma: PrismaService;

  const mockCity = {
    id: 'city-1',
    nameEn: 'Tel Aviv',
    nameHe: 'תל אביב',
    slug: 'tel-aviv',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaLawyer = {
    id: '1',
    fullNameEn: 'Test Lawyer',
    fullNameHe: 'עורך דין לבדיקה',
    cityId: 'city-1',
    city: mockCity,
    specialties: ['CRIMINAL'],
    yearsOfExperience: 5,
    ratingVector: {
      professionalism: 85,
      availability: 90,
      empathy: 75,
      cost: 60,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    lawyer: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LawyersRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<LawyersRepository>(LawyersRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all lawyers with empty filter', async () => {
      const filter: LawyerFilterDto = {};
      mockPrismaService.lawyer.findMany.mockResolvedValue([mockPrismaLawyer]);

      const result = await repository.findAll(filter);

      expect(result).toEqual([mockPrismaLawyer]);
      expect(prisma.lawyer.findMany).toHaveBeenCalledWith({
        where: {},
        include: { city: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by city', async () => {
      const filter: LawyerFilterDto = { city: 'Tel Aviv' };
      mockPrismaService.lawyer.findMany.mockResolvedValue([mockPrismaLawyer]);

      await repository.findAll(filter);

      expect(prisma.lawyer.findMany).toHaveBeenCalledWith({
        where: {
          city: {
            OR: [
              { nameEn: { contains: 'Tel Aviv', mode: 'insensitive' } },
              { nameHe: { contains: 'Tel Aviv', mode: 'insensitive' } },
            ],
          },
        },
        include: { city: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by specialties', async () => {
      const filter: LawyerFilterDto = { specialties: ['CRIMINAL', 'CIVIL'] };
      mockPrismaService.lawyer.findMany.mockResolvedValue([mockPrismaLawyer]);

      await repository.findAll(filter);

      expect(prisma.lawyer.findMany).toHaveBeenCalledWith({
        where: {
          specialties: {
            hasSome: ['CRIMINAL', 'CIVIL'],
          },
        },
        include: { city: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by minimum years of experience', async () => {
      const filter: LawyerFilterDto = { minYearsOfExperience: 3 };
      mockPrismaService.lawyer.findMany.mockResolvedValue([mockPrismaLawyer]);

      await repository.findAll(filter);

      expect(prisma.lawyer.findMany).toHaveBeenCalledWith({
        where: {
          yearsOfExperience: {
            gte: 3,
          },
        },
        include: { city: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should apply multiple filters together', async () => {
      const filter: LawyerFilterDto = {
        city: 'Tel Aviv',
        specialties: ['CRIMINAL'],
        minYearsOfExperience: 5,
      };
      mockPrismaService.lawyer.findMany.mockResolvedValue([mockPrismaLawyer]);

      await repository.findAll(filter);

      expect(prisma.lawyer.findMany).toHaveBeenCalledWith({
        where: {
          city: {
            OR: [
              { nameEn: { contains: 'Tel Aviv', mode: 'insensitive' } },
              { nameHe: { contains: 'Tel Aviv', mode: 'insensitive' } },
            ],
          },
          specialties: {
            hasSome: ['CRIMINAL'],
          },
          yearsOfExperience: {
            gte: 5,
          },
        },
        include: { city: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no lawyers found', async () => {
      const filter: LawyerFilterDto = { city: 'Unknown' };
      mockPrismaService.lawyer.findMany.mockResolvedValue([]);

      const result = await repository.findAll(filter);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a lawyer by ID', async () => {
      const id = '1';
      mockPrismaService.lawyer.findUnique.mockResolvedValue(mockPrismaLawyer);

      const result = await repository.findOne(id);

      expect(result).toEqual(mockPrismaLawyer);
      expect(prisma.lawyer.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: { city: true },
      });
    });

    it('should return null when lawyer not found', async () => {
      const id = 'non-existent';
      mockPrismaService.lawyer.findUnique.mockResolvedValue(null);

      const result = await repository.findOne(id);

      expect(result).toBeNull();
      expect(prisma.lawyer.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: { city: true },
      });
    });
  });

  describe('create', () => {
    it('should create a new lawyer', async () => {
      const createDto: CreateLawyerDto = {
        fullNameEn: 'Test Lawyer',
        fullNameHe: 'עורך דין לבדיקה',
        cityId: 'city-1',
        specialties: ['CRIMINAL'],
        yearsOfExperience: 5,
        ratingVector: {
          professionalism: 85,
          availability: 90,
          empathy: 75,
          cost: 60,
        },
      };
      mockPrismaService.lawyer.create.mockResolvedValue(mockPrismaLawyer);

      const result = await repository.create(createDto);

      expect(result).toEqual(mockPrismaLawyer);
      expect(prisma.lawyer.create).toHaveBeenCalledWith({
        data: {
          fullNameEn: createDto.fullNameEn,
          fullNameHe: createDto.fullNameHe,
          bioEn: undefined,
          bioHe: undefined,
          cityId: createDto.cityId,
          specialties: createDto.specialties,
          yearsOfExperience: createDto.yearsOfExperience,
          ratingVector: createDto.ratingVector,
        },
        include: { city: true },
      });
    });

    it('should handle creation with multiple specialties', async () => {
      const createDto: CreateLawyerDto = {
        fullNameEn: 'Multi Specialty Lawyer',
        fullNameHe: 'עורך דין רב תחומי',
        cityId: 'city-1',
        specialties: ['CRIMINAL', 'CIVIL', 'FAMILY'],
        yearsOfExperience: 10,
        ratingVector: {
          professionalism: 90,
          availability: 85,
          empathy: 80,
          cost: 70,
        },
      };
      const multiSpecialtyLawyer = {
        ...mockPrismaLawyer,
        fullNameEn: createDto.fullNameEn,
        fullNameHe: createDto.fullNameHe,
        cityId: createDto.cityId,
        specialties: createDto.specialties,
        yearsOfExperience: createDto.yearsOfExperience,
        ratingVector: createDto.ratingVector,
      };
      mockPrismaService.lawyer.create.mockResolvedValue(multiSpecialtyLawyer);

      const result = await repository.create(createDto);

      expect(result).toEqual(multiSpecialtyLawyer);
      expect(result.specialties).toHaveLength(3);
    });

    it('should create a lawyer with bio fields', async () => {
      const createDto: CreateLawyerDto = {
        fullNameEn: 'Test Lawyer',
        fullNameHe: 'עורך דין לבדיקה',
        bioEn: 'Experienced criminal lawyer',
        bioHe: 'עורך דין פלילי מנוסה',
        cityId: 'city-1',
        specialties: ['CRIMINAL'],
        yearsOfExperience: 5,
        ratingVector: {
          professionalism: 85,
          availability: 90,
          empathy: 75,
          cost: 60,
        },
      };
      const lawyerWithBio = {
        ...mockPrismaLawyer,
        bioEn: createDto.bioEn,
        bioHe: createDto.bioHe,
      };
      mockPrismaService.lawyer.create.mockResolvedValue(lawyerWithBio);

      const result = await repository.create(createDto);

      expect(result.bioEn).toBe('Experienced criminal lawyer');
      expect(result.bioHe).toBe('עורך דין פלילי מנוסה');
      expect(prisma.lawyer.create).toHaveBeenCalledWith({
        data: {
          fullNameEn: createDto.fullNameEn,
          fullNameHe: createDto.fullNameHe,
          bioEn: createDto.bioEn,
          bioHe: createDto.bioHe,
          cityId: createDto.cityId,
          specialties: createDto.specialties,
          yearsOfExperience: createDto.yearsOfExperience,
          ratingVector: createDto.ratingVector,
        },
        include: { city: true },
      });
    });
  });
});
