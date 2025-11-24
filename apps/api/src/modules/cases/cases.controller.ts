import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { CaseFilterDto } from './dto/case-filter.dto';

@ApiTags('cases')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create or update a case',
    description: 'Upserts a case based on externalId. If case exists, updates it; otherwise creates new.'
  })
  @ApiResponse({ status: 201, description: 'Case created or updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async upsertCase(@Body() createCaseDto: CreateCaseDto) {
    return this.casesService.upsertCase(createCaseDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all cases',
    description: 'Returns all cases ordered by closed date (descending). Supports filtering by search, specialty, name, year, and status.'
  })
  @ApiResponse({ status: 200, description: 'Cases retrieved successfully' })
  async findAll(@Query() filter: CaseFilterDto) {
    return this.casesService.findAll(filter);
  }

  @Get(':externalId')
  @ApiOperation({
    summary: 'Get case by external ID',
    description: 'Finds a case by its court system ID'
  })
  @ApiParam({ name: 'externalId', description: 'Court system case ID', example: '12345-01-24' })
  @ApiResponse({ status: 200, description: 'Case found' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  async findByExternalId(@Param('externalId') externalId: string) {
    return this.casesService.findByExternalId(externalId);
  }
}
