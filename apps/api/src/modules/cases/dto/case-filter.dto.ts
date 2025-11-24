import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CaseFilterParams, CaseResult } from '@dingo/types';

export class CaseFilterDto implements CaseFilterParams {
  @ApiPropertyOptional({
    description: 'Free text search in case title and judge name',
    example: 'contract dispute'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by legal specialty',
    example: 'CRIMINAL'
  })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({
    description: 'Filter by case name/title',
    example: 'Cohen vs. Advanced'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by case year (from closedAt)',
    example: 2024,
    minimum: 1900
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year?: number;

  @ApiPropertyOptional({
    description: 'Filter by case result/status',
    example: 'DEFENCE_WON',
    enum: ['DEFENCE_WON', 'ATTACK_WON', 'settlement', 'dismissed', 'other']
  })
  @IsOptional()
  @IsEnum(['DEFENCE_WON', 'ATTACK_WON', 'settlement', 'dismissed', 'other'])
  status?: CaseResult;
}
