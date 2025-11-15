import { Controller, Get, Post, Body, Query, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LawyersService } from './lawyers.service';
import { CreateLawyerDto } from './dto/create-lawyer.dto';
import { LawyerFilterDto } from './dto/lawyer-filter.dto';
import { Lawyer } from '@dingo/types';

@ApiTags('lawyers')
@Controller('lawyers')
export class LawyersController {
  constructor(private readonly lawyersService: LawyersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lawyers', description: 'Returns filtered list of lawyers' })
  @ApiResponse({ status: 200, description: 'Lawyers retrieved successfully' })
  async findAll(@Query() filter: LawyerFilterDto): Promise<Lawyer[]> {
    return this.lawyersService.findAll(filter);
  }

  @Post()
  @ApiOperation({ summary: 'Create a lawyer', description: 'Creates a new lawyer record' })
  @ApiResponse({ status: 201, description: 'Lawyer created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createLawyerDto: CreateLawyerDto): Promise<Lawyer> {
    return this.lawyersService.create(createLawyerDto);
  }

  @Get('search/:name')
  @ApiOperation({ summary: 'Search lawyer by name', description: 'Finds lawyer by English or Hebrew name (fuzzy match)' })
  @ApiParam({ name: 'name', description: 'Lawyer name to search', example: 'Rachel Levi' })
  @ApiResponse({ status: 200, description: 'Lawyer found or null' })
  async findByName(@Param('name') name: string) {
    return this.lawyersService.findByName(name);
  }

  @Post('pending')
  @ApiOperation({ summary: 'Create pending lawyer', description: 'Creates a lawyer with "Pending Verification" status' })
  @ApiResponse({ status: 201, description: 'Pending lawyer created' })
  async createPending(@Body('name') name: string) {
    return this.lawyersService.createPending(name);
  }

  @Patch(':id/cases/:caseId')
  @ApiOperation({ summary: 'Add case to lawyer', description: 'Adds a case ID to lawyer\'s caseIds array' })
  @ApiParam({ name: 'id', description: 'Lawyer ID', example: 'lawyer-uuid-123' })
  @ApiParam({ name: 'caseId', description: 'Case ID to add', example: 'case-uuid-456' })
  @ApiResponse({ status: 200, description: 'Case added to lawyer successfully' })
  @ApiResponse({ status: 404, description: 'Lawyer not found' })
  async addCaseToLawyer(
    @Param('id') lawyerId: string,
    @Param('caseId') caseId: string
  ) {
    await this.lawyersService.addCaseToLawyer(lawyerId, caseId);
    return { message: 'Case added successfully' };
  }
}
