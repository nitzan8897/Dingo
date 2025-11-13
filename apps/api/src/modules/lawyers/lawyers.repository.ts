import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLawyerDto } from './dto/create-lawyer.dto';
import { LawyerFilterDto } from './dto/lawyer-filter.dto';
import { Lawyer } from '@dingo/types';

/**
 * Lawyers repository
 * Data access layer
 * Single Responsibility: Only handles data persistence
 * Interface Segregation: Provides only necessary methods
 */
@Injectable()
export class LawyersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: LawyerFilterDto): Promise<Lawyer[]> {
    const where: any = {};

    if (filter.city) {
      where.city = {
        contains: filter.city,
        mode: 'insensitive',
      };
    }

    if (filter.specialty) {
      where.specialties = {
        has: filter.specialty,
      };
    }

    if (filter.minYearsOfExperience) {
      where.yearsOfExperience = {
        gte: filter.minYearsOfExperience,
      };
    }

    const lawyers = await this.prisma.lawyer.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return lawyers.map(this.mapToLawyer);
  }

  async create(createLawyerDto: CreateLawyerDto): Promise<Lawyer> {
    const lawyer = await this.prisma.lawyer.create({
      data: {
        fullName: createLawyerDto.fullName,
        city: createLawyerDto.city,
        specialties: createLawyerDto.specialties,
        yearsOfExperience: createLawyerDto.yearsOfExperience,
        ratingVector: createLawyerDto.ratingVector,
      },
    });

    return this.mapToLawyer(lawyer);
  }

  private mapToLawyer(lawyer: any): Lawyer {
    return {
      id: lawyer.id,
      fullName: lawyer.fullName,
      city: lawyer.city,
      specialties: lawyer.specialties,
      yearsOfExperience: lawyer.yearsOfExperience,
      ratingVector: lawyer.ratingVector,
      createdAt: lawyer.createdAt,
      updatedAt: lawyer.updatedAt,
    };
  }
}
