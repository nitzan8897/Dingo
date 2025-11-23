import { LawyerService } from '../lawyer-service';
import { Lawyer } from '@dingo/types';

describe('LawyerService', () => {
  let service: LawyerService;

  beforeEach(() => {
    service = new LawyerService('http://localhost:3001/v1');
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchLawyerById', () => {
    it('should fetch a single lawyer by ID', async () => {
      const mockLawyer: Lawyer = {
        id: 'abc-123',
        fullNameEn: 'John Doe',
        fullNameHe: 'ג\'ון דו',
        cityId: 'city-1',
        city: {
          id: 'city-1',
          nameEn: 'Tel Aviv',
          nameHe: 'תל אביב',
          slug: 'tel-aviv',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        specialties: ['CRIMINAL'],
        yearsOfExperience: 10,
        ratingVector: {
          professionalism: 85,
          availability: 90,
          empathy: 75,
          cost: 70,
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockLawyer,
      });

      const result = await service.fetchLawyerById('abc-123');

      expect(result).toEqual(mockLawyer);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/v1/lawyers/abc-123',
        expect.objectContaining({
          next: { revalidate: 60 },
        })
      );
    });

    it('should throw error when lawyer not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(service.fetchLawyerById('invalid-id')).rejects.toThrow(
        'Failed to fetch lawyer: Not Found'
      );
    });
  });
});
