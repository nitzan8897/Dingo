import { Test, TestingModule } from '@nestjs/testing';
import { LawyersRepository } from './lawyers.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLawyerDto } from './dto/create-lawyer.dto';
import { LawyerFilterDto } from './dto/lawyer-filter.dto';

describe('LawyersRepository', () => {
  let repository: LawyersRepository;
  let prisma: PrismaService;

  const mockPrismaLawyer = {
    id: '1',
    fullName: 'Test Lawyer',
    city: 'Tel Aviv',
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
            contains: 'Tel Aviv',
            mode: 'insensitive',
          },
        },
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
            contains: 'Tel Aviv',
            mode: 'insensitive',
          },
          specialties: {
            hasSome: ['CRIMINAL'],
          },
          yearsOfExperience: {
            gte: 5,
          },
        },
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

  describe('create', () => {
    it('should create a new lawyer', async () => {
      const createDto: CreateLawyerDto = {
        fullName: 'Test Lawyer',
        city: 'Tel Aviv',
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
          fullName: createDto.fullName,
          city: createDto.city,
          specialties: createDto.specialties,
          yearsOfExperience: createDto.yearsOfExperience,
          ratingVector: createDto.ratingVector,
        },
      });
    });

    it('should handle creation with multiple specialties', async () => {
      const createDto: CreateLawyerDto = {
        fullName: 'Multi Specialty Lawyer',
        city: 'Jerusalem',
        specialties: ['CRIMINAL', 'CIVIL', 'FAMILY'],
        yearsOfExperience: 10,
        ratingVector: {
          professionalism: 90,
          availability: 85,
          empathy: 80,
          cost: 70,
        },
      };
      const multiSpecialtyLawyer = { ...mockPrismaLawyer, ...createDto };
      mockPrismaService.lawyer.create.mockResolvedValue(multiSpecialtyLawyer);

      const result = await repository.create(createDto);

      expect(result).toEqual(multiSpecialtyLawyer);
      expect(result.specialties).toHaveLength(3);
    });
  });
});
