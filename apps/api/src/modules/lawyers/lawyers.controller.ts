import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { LawyersService } from './lawyers.service';
import { CreateLawyerDto } from './dto/create-lawyer.dto';
import { LawyerFilterDto } from './dto/lawyer-filter.dto';
import { Lawyer } from '@dingo/types';

/**
 * Lawyers controller
 * Handles HTTP requests and delegates to service layer
 * Single Responsibility: Only handles HTTP concerns
 */
@Controller('lawyers')
export class LawyersController {
  constructor(private readonly lawyersService: LawyersService) {}

  @Get()
  async findAll(@Query() filter: LawyerFilterDto): Promise<Lawyer[]> {
    return this.lawyersService.findAll(filter);
  }

  @Post()
  async create(@Body() createLawyerDto: CreateLawyerDto): Promise<Lawyer> {
    return this.lawyersService.create(createLawyerDto);
  }
}
