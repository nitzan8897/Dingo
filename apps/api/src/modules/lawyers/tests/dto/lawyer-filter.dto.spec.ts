import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LawyerFilterDto } from '../../dto/lawyer-filter.dto';

describe('LawyerFilterDto', () => {
  describe('specialties transformation', () => {
    it('transforms comma-separated string to array', async () => {
      const plain = { specialties: 'CRIMINAL,CIVIL,FAMILY' };
      const dto = plainToInstance(LawyerFilterDto, plain);

      expect(dto.specialties).toEqual(['CRIMINAL', 'CIVIL', 'FAMILY']);
    });

    it('trims whitespace from specialty values', async () => {
      const plain = { specialties: 'CRIMINAL, CIVIL , FAMILY' };
      const dto = plainToInstance(LawyerFilterDto, plain);

      expect(dto.specialties).toEqual(['CRIMINAL', 'CIVIL', 'FAMILY']);
    });

    it('filters out empty strings', async () => {
      const plain = { specialties: 'CRIMINAL,,CIVIL,' };
      const dto = plainToInstance(LawyerFilterDto, plain);

      expect(dto.specialties).toEqual(['CRIMINAL', 'CIVIL']);
    });

    it('handles single specialty without comma', async () => {
      const plain = { specialties: 'CRIMINAL' };
      const dto = plainToInstance(LawyerFilterDto, plain);

      expect(dto.specialties).toEqual(['CRIMINAL']);
    });

    it('handles array input directly', async () => {
      const plain = { specialties: ['CRIMINAL', 'CIVIL'] };
      const dto = plainToInstance(LawyerFilterDto, plain);

      expect(dto.specialties).toEqual(['CRIMINAL', 'CIVIL']);
    });

    it('returns empty array for empty string', async () => {
      const plain = { specialties: '' };
      const dto = plainToInstance(LawyerFilterDto, plain);

      expect(dto.specialties).toEqual([]);
    });
  });

  describe('validation', () => {
    it('validates successfully with valid specialties array', async () => {
      const dto = plainToInstance(LawyerFilterDto, {
        specialties: ['CRIMINAL', 'CIVIL'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('validates successfully with valid city', async () => {
      const dto = plainToInstance(LawyerFilterDto, {
        city: 'New York',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('validates successfully with valid minYearsOfExperience', async () => {
      const dto = plainToInstance(LawyerFilterDto, {
        minYearsOfExperience: 5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('validates successfully with all filters', async () => {
      const dto = plainToInstance(LawyerFilterDto, {
        specialties: 'CRIMINAL,CIVIL',
        city: 'New York',
        minYearsOfExperience: 10,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('accepts optional fields as undefined', async () => {
      const dto = plainToInstance(LawyerFilterDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('rejects negative minYearsOfExperience', async () => {
      const dto = plainToInstance(LawyerFilterDto, {
        minYearsOfExperience: -1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('minYearsOfExperience');
    });

    it('rejects non-integer minYearsOfExperience', async () => {
      const dto = plainToInstance(LawyerFilterDto, {
        minYearsOfExperience: 5.5,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('handles very long specialty list', async () => {
      const specialties = Array(100).fill('CRIMINAL').join(',');
      const plain = { specialties };
      const dto = plainToInstance(LawyerFilterDto, plain);

      expect(dto.specialties).toHaveLength(100);
    });

    it('handles specialty list with special characters that need trimming', async () => {
      const plain = { specialties: '  CRIMINAL  ,  CIVIL  ' };
      const dto = plainToInstance(LawyerFilterDto, plain);

      expect(dto.specialties).toEqual(['CRIMINAL', 'CIVIL']);
    });

    it('preserves underscore in specialty names', async () => {
      const plain = { specialties: 'REAL_ESTATE,INTELLECTUAL_PROPERTY' };
      const dto = plainToInstance(LawyerFilterDto, plain);

      expect(dto.specialties).toEqual(['REAL_ESTATE', 'INTELLECTUAL_PROPERTY']);
    });
  });
});
