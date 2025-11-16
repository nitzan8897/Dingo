import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    const where: Prisma.LawyerWhereInput = {};

    if (filter.city) {
      where.city = {
        contains: filter.city,
        mode: 'insensitive',
      };
    }

    if (filter.specialties && filter.specialties.length > 0) {
      where.specialties = {
        hasSome: filter.specialties,
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

  async findOne(id: string): Promise<Lawyer | null> {
    const lawyer = await this.prisma.lawyer.findUnique({
      where: { id },
    });

    if (!lawyer) {
      return null;
    }

    return this.mapToLawyer(lawyer);
  }

  async create(createLawyerDto: CreateLawyerDto): Promise<Lawyer> {
    const lawyer = await this.prisma.lawyer.create({
      data: {
        fullNameEn: createLawyerDto.fullNameEn,
        fullNameHe: createLawyerDto.fullNameHe,
        city: createLawyerDto.city,
        specialties: createLawyerDto.specialties,
        yearsOfExperience: createLawyerDto.yearsOfExperience,
        ratingVector: {
          professionalism: createLawyerDto.ratingVector.professionalism,
          availability: createLawyerDto.ratingVector.availability,
          empathy: createLawyerDto.ratingVector.empathy,
          cost: createLawyerDto.ratingVector.cost,
        },
      },
    });

    return this.mapToLawyer(lawyer);
  }

  private mapToLawyer(lawyer: Prisma.LawyerGetPayload<object>): Lawyer {
    return {
      id: lawyer.id,
      fullNameEn: lawyer.fullNameEn,
      fullNameHe: lawyer.fullNameHe,
      city: lawyer.city,
      specialties: lawyer.specialties,
      yearsOfExperience: lawyer.yearsOfExperience,
      ratingVector: lawyer.ratingVector as unknown as Lawyer['ratingVector'],
      createdAt: lawyer.createdAt,
      updatedAt: lawyer.updatedAt,
    };
  }
}
