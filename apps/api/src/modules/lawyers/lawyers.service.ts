import { Injectable, NotFoundException } from '@nestjs/common';
import { LawyersRepository } from './lawyers.repository';
import { CreateLawyerDto } from './dto/create-lawyer.dto';
import { LawyerFilterDto } from './dto/lawyer-filter.dto';
import { Lawyer } from '@dingo/types';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Lawyers service
 * Business logic layer
 * Single Responsibility: Only handles business logic
 * Depends on abstraction (repository), not concrete implementation
 */
@Injectable()
export class LawyersService {
  constructor(
    private readonly lawyersRepository: LawyersRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(filter: LawyerFilterDto): Promise<Lawyer[]> {
    return this.lawyersRepository.findAll(filter);
  }

  async findOne(id: string): Promise<Lawyer> {
    const lawyer = await this.lawyersRepository.findOne(id);
    if (!lawyer) {
      throw new NotFoundException(`Lawyer with ID ${id} not found`);
    }
    return lawyer;
  }

  async create(createLawyerDto: CreateLawyerDto): Promise<Lawyer> {
    return this.lawyersRepository.create(createLawyerDto);
  }

  async findByName(name: string) {
    return this.lawyersRepository.findByName(name);
  }

  async createPending(name: string, cityId?: string) {
    // Use provided cityId or get the "Unknown" city
    let finalCityId = cityId;
    if (!finalCityId) {
      const unknownCity = await this.prisma.city.findUnique({
        where: { slug: 'unknown' },
      });
      if (!unknownCity) {
        throw new NotFoundException('Unknown city not found in database. Please run seed.');
      }
      finalCityId = unknownCity.id;
    }
    return this.lawyersRepository.createPending(name, finalCityId);
  }

  async addCaseToLawyer(lawyerId: string, caseId: string): Promise<void> {
    return this.lawyersRepository.addCaseToLawyer(lawyerId, caseId);
  }
}
