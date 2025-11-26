import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { LawyersModule } from './modules/lawyers/lawyers.module';
import { CasesModule } from './modules/cases/cases.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { GraphQLModule } from './modules/graphql/graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    GraphQLModule,
    HealthModule,
    LawyersModule,
    CasesModule,
  ],
})
export class AppModule {}
