import { Test, TestingModule } from '@nestjs/testing';
import { LawyersController } from '../lawyers.controller';
import { LawyersService } from '../lawyers.service';
import { CreateLawyerDto } from '../dto/create-lawyer.dto';
import { LawyerFilterDto } from '../dto/lawyer-filter.dto';
import { Lawyer } from '@dingo/types';

describe('LawyersController', () => {
  let controller: LawyersController;
  let service: LawyersService;

  const mockLawyer: Lawyer = {
    id: '1',
    fullNameEn: 'Test Lawyer',
    fullNameHe: 'עורך דין לבדיקה',
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

  const mockLawyersService = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LawyersController],
      providers: [
        {
          provide: LawyersService,
          useValue: mockLawyersService,
        },
      ],
    }).compile();

    controller = module.get<LawyersController>(LawyersController);
    service = module.get<LawyersService>(LawyersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of lawyers', async () => {
      const filter: LawyerFilterDto = {};
      const result = [mockLawyer];
      mockLawyersService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(filter)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(filter);
    });

    it('should pass filter parameters to service', async () => {
      const filter: LawyerFilterDto = {
        city: 'Tel Aviv',
        specialties: ['CRIMINAL'],
        minYearsOfExperience: 3,
      };
      mockLawyersService.findAll.mockResolvedValue([mockLawyer]);

      await controller.findAll(filter);

      expect(service.findAll).toHaveBeenCalledWith(filter);
    });

    it('should return empty array when no lawyers match', async () => {
      const filter: LawyerFilterDto = { city: 'Unknown' };
      mockLawyersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(filter);

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('create', () => {
    it('should create a new lawyer', async () => {
      const createDto: CreateLawyerDto = {
        fullNameEn: 'Test Lawyer',
        fullNameHe: 'עורך דין לבדיקה',
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
      mockLawyersService.create.mockResolvedValue(mockLawyer);

      expect(await controller.create(createDto)).toBe(mockLawyer);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle creation with minimal data', async () => {
      const createDto: CreateLawyerDto = {
        fullNameEn: 'Minimal Lawyer',
        fullNameHe: 'עורך דין מינימלי',
        city: 'Jerusalem',
        specialties: ['CIVIL'],
        yearsOfExperience: 1,
        ratingVector: {
          professionalism: 50,
          availability: 50,
          empathy: 50,
          cost: 50,
        },
      };
      const minimalLawyer = { ...mockLawyer, ...createDto };
      mockLawyersService.create.mockResolvedValue(minimalLawyer);

      const result = await controller.create(createDto);

      expect(result).toBe(minimalLawyer);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });
});
