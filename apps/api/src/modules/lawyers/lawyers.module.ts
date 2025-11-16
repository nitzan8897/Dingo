import { Module } from '@nestjs/common';
import { LawyersController } from './lawyers.controller';
import { LawyersService } from './lawyers.service';
import { LawyersRepository } from './lawyers.repository';

/**
 * Lawyers module
 * Follows dependency injection and separation of concerns
 */
@Module({
  controllers: [LawyersController],
  providers: [LawyersService, LawyersRepository],
  exports: [LawyersService, LawyersRepository],
})
export class LawyersModule {}
