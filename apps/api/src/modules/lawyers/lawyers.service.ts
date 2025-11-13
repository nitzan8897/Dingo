import { Injectable } from '@nestjs/common';
import { LawyersRepository } from './lawyers.repository';
import { CreateLawyerDto } from './dto/create-lawyer.dto';
import { LawyerFilterDto } from './dto/lawyer-filter.dto';
import { Lawyer } from '@dingo/types';

/**
 * Lawyers service
 * Business logic layer
 * Single Responsibility: Only handles business logic
 * Depends on abstraction (repository), not concrete implementation
 */
@Injectable()
export class LawyersService {
  constructor(private readonly lawyersRepository: LawyersRepository) {}

  async findAll(filter: LawyerFilterDto): Promise<Lawyer[]> {
    return this.lawyersRepository.findAll(filter);
  }

  async create(createLawyerDto: CreateLawyerDto): Promise<Lawyer> {
    return this.lawyersRepository.create(createLawyerDto);
  }
}
