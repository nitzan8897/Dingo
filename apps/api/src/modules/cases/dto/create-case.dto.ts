import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max, IsArray, IsDateString, IsEnum } from 'class-validator';
import { CreateCaseDTO, CaseResult } from '@dingo/types';

export class CreateCaseDto implements CreateCaseDTO {
  @ApiProperty({ description: 'Unique case ID from court system', example: '12345-01-24' })
  @IsString()
  externalId: string;

  @ApiProperty({ description: 'Case title', example: 'Cohen vs. Advanced Construction Ltd.' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Legal specialty', example: 'CIVIL' })
  @IsString()
  specialty: string;

  @ApiProperty({
    description: 'Case result',
    example: 'win',
    enum: ['win', 'lose', 'settlement', 'dismissed', 'other']
  })
  @IsEnum(['win', 'lose', 'settlement', 'dismissed', 'other'])
  result: CaseResult;

  @ApiProperty({ description: 'Judge name', required: false, example: 'Judge David Cohen' })
  @IsOptional()
  @IsString()
  judgeName?: string;

  @ApiProperty({ description: 'PDF file URL', required: false, example: 'https://example.com/cases/12345.pdf' })
  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @ApiProperty({ description: 'Case opened date', required: false, example: '2024-01-15T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  openedAt?: string;

  @ApiProperty({ description: 'Case closed date', required: false, example: '2024-06-20T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  closedAt?: string;

  @ApiProperty({ description: 'Complexity score (0-1)', example: 0.7, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  complexityScore: number;

  @ApiProperty({ description: 'Full case text', example: 'בית המשפט...' })
  @IsString()
  rawText: string;

  @ApiProperty({ description: 'Plaintiff lawyer IDs', type: [String], example: ['lawyer-uuid-1'] })
  @IsArray()
  @IsString({ each: true })
  plaintiffLawyerIds: string[];

  @ApiProperty({ description: 'Defendant lawyer IDs', type: [String], example: ['lawyer-uuid-2'] })
  @IsArray()
  @IsString({ each: true })
  defendantLawyerIds: string[];

  @ApiProperty({ description: 'Associated lawyer IDs', type: [String], example: [] })
  @IsArray()
  @IsString({ each: true })
  associatedLawyerIds: string[];
}
