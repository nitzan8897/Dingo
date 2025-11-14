import { Test, TestingModule } from '@nestjs/testing';
import { LawyersService } from './lawyers.service';
import { LawyersRepository } from './lawyers.repository';

describe('LawyersService', () => {
  let service: LawyersService;
  let repository: LawyersRepository;

  const mockLawyer = {
    id: '1',
    fullName: 'John Doe',
    city: 'New York',
    specialties: ['CRIMINAL', 'CIVIL'],
    yearsOfExperience: 10,
    ratingVector: {
      professionalism: 95,
      availability: 88,
      empathy: 92,
      cost: 75,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LawyersService,
        {
          provide: LawyersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LawyersService>(LawyersService);
    repository = module.get<LawyersRepository>(LawyersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of lawyers', async () => {
      const lawyers = [mockLawyer];
      mockRepository.findAll.mockResolvedValue(lawyers);

      const result = await service.findAll({});

      expect(result).toEqual(lawyers);
      expect(repository.findAll).toHaveBeenCalledWith({});
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should pass filters to repository', async () => {
      const filter = { city: 'New York', specialties: ['CRIMINAL'] };
      mockRepository.findAll.mockResolvedValue([mockLawyer]);

      await service.findAll(filter);

      expect(repository.findAll).toHaveBeenCalledWith(filter);
    });

    it('should filter by multiple specialties', async () => {
      const filter = { specialties: ['CRIMINAL', 'CIVIL', 'FAMILY'] };
      mockRepository.findAll.mockResolvedValue([mockLawyer]);

      const result = await service.findAll(filter);

      expect(result).toEqual([mockLawyer]);
      expect(repository.findAll).toHaveBeenCalledWith(filter);
    });

    it('should combine multiple filters', async () => {
      const filter = {
        city: 'New York',
        specialties: ['CRIMINAL', 'CIVIL'],
        minYearsOfExperience: 5,
      };
      mockRepository.findAll.mockResolvedValue([mockLawyer]);

      await service.findAll(filter);

      expect(repository.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('create', () => {
    it('should create a lawyer', async () => {
      const createDto = {
        fullName: 'John Doe',
        city: 'New York',
        specialties: ['CRIMINAL', 'CIVIL'],
        yearsOfExperience: 10,
        ratingVector: {
          professionalism: 95,
          availability: 88,
          empathy: 92,
          cost: 75,
        },
      };

      mockRepository.create.mockResolvedValue(mockLawyer);

      const result = await service.create(createDto);

      expect(result).toEqual(mockLawyer);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.create).toHaveBeenCalledTimes(1);
    });
  });
});
