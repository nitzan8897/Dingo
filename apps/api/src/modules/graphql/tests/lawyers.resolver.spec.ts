import { Test, TestingModule } from '@nestjs/testing';
import { LawyersService } from '../../lawyers/lawyers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { LawyersResolver } from '../resolvers/lawyers.resolver';

describe('LawyersResolver', () => {
  let resolver: LawyersResolver;
  let lawyersService: LawyersService;
  let prismaService: PrismaService;

  const mockLawyer = {
    id: '1',
    fullNameEn: 'John Doe',
    fullNameHe: 'ג\'ון דו',
    bioEn: 'Experienced lawyer',
    bioHe: 'עורך דין מנוסה',
    cityId: 'city-1',
    specialties: ['CRIMINAL', 'CIVIL'],
    yearsOfExperience: 10,
    ratingVector: {
      professionalism: 90,
      availability: 85,
      empathy: 88,
      cost: 75,
    },
    caseIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCity = {
    id: 'city-1',
    nameEn: 'Tel Aviv',
    nameHe: 'תל אביב',
    slug: 'tel-aviv',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLawyersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
  };

  const mockPrismaService = {
    city: {
      findUnique: jest.fn(),
    },
    review: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LawyersResolver,
        {
          provide: LawyersService,
          useValue: mockLawyersService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    resolver = module.get<LawyersResolver>(LawyersResolver);
    lawyersService = module.get<LawyersService>(LawyersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of lawyers', async () => {
      mockLawyersService.findAll.mockResolvedValue([mockLawyer]);

      const result = await resolver.findAll();

      expect(result).toEqual([mockLawyer]);
      expect(lawyersService.findAll).toHaveBeenCalledWith({});
    });

    it('should apply filters when provided', async () => {
      const filter = { city: 'Tel Aviv', minYearsOfExperience: 5 };
      mockLawyersService.findAll.mockResolvedValue([mockLawyer]);

      const result = await resolver.findAll(filter);

      expect(result).toEqual([mockLawyer]);
      expect(lawyersService.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('findOne', () => {
    it('should return a single lawyer', async () => {
      mockLawyersService.findOne.mockResolvedValue(mockLawyer);

      const result = await resolver.findOne('1');

      expect(result).toEqual(mockLawyer);
      expect(lawyersService.findOne).toHaveBeenCalledWith('1');
    });

    it('should return null if lawyer not found', async () => {
      mockLawyersService.findOne.mockResolvedValue(null);

      const result = await resolver.findOne('999');

      expect(result).toBeNull();
      expect(lawyersService.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('searchByName', () => {
    it('should search lawyers by name', async () => {
      mockLawyersService.findByName.mockResolvedValue([mockLawyer]);

      const result = await resolver.searchByName('John');

      expect(result).toEqual([mockLawyer]);
      expect(lawyersService.findByName).toHaveBeenCalledWith('John');
    });
  });

  describe('createLawyer', () => {
    it('should create a new lawyer', async () => {
      const input = {
        fullNameEn: 'John Doe',
        fullNameHe: 'ג\'ון דו',
        bioEn: 'Experienced lawyer',
        bioHe: 'עורך דין מנוסה',
        cityId: 'city-1',
        specialties: ['CRIMINAL', 'CIVIL'],
        yearsOfExperience: 10,
        ratingVector: {
          professionalism: 90,
          availability: 85,
          empathy: 88,
          cost: 75,
        },
      };

      mockLawyersService.create.mockResolvedValue(mockLawyer);

      const result = await resolver.createLawyer(input);

      expect(result).toEqual(mockLawyer);
      expect(lawyersService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('city field resolver', () => {
    it('should resolve the city for a lawyer', async () => {
      mockPrismaService.city.findUnique.mockResolvedValue(mockCity);

      const result = await resolver.city(mockLawyer as any);

      expect(result).toEqual(mockCity);
      expect(prismaService.city.findUnique).toHaveBeenCalledWith({
        where: { id: 'city-1' },
      });
    });
  });

  describe('reviews field resolver', () => {
    it('should resolve reviews for a lawyer', async () => {
      const mockReviews = [
        {
          id: 'review-1',
          lawyerId: '1',
          reviewerName: 'Alice',
          rating: 5,
          commentEn: 'Great lawyer',
          commentHe: 'עורך דין מעולה',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.review.findMany.mockResolvedValue(mockReviews);

      const result = await resolver.reviews(mockLawyer as any);

      expect(result).toEqual(mockReviews);
      expect(prismaService.review.findMany).toHaveBeenCalledWith({
        where: { lawyerId: '1' },
      });
    });
  });
});
