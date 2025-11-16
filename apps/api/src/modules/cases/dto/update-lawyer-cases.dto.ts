import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateLawyerCasesDto {
  @ApiProperty({ description: 'Case ID to add to lawyer', example: 'case-uuid-123' })
  @IsString()
  caseId: string;
}
