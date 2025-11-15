import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  const mockHealthService = {
    check: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health status', () => {
      const healthResponse = {
        status: 'ok' as const,
        timestamp: expect.any(String),
      };
      mockHealthService.check.mockReturnValue(healthResponse);

      const result = controller.check();

      expect(result).toEqual(healthResponse);
      expect(service.check).toHaveBeenCalled();
    });

    it('should call health service check method', () => {
      mockHealthService.check.mockReturnValue({
        status: 'ok' as const,
        timestamp: new Date().toISOString(),
      });

      controller.check();

      expect(service.check).toHaveBeenCalledTimes(1);
    });
  });
});
