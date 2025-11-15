import { Module } from '@nestjs/common';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import { CasesRepository } from './cases.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { LawyersModule } from '../lawyers/lawyers.module';

@Module({
  imports: [PrismaModule, LawyersModule],
  controllers: [CasesController],
  providers: [CasesService, CasesRepository],
  exports: [CasesService],
})
export class CasesModule {}
