import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { CasesModule } from '../cases/cases.module';
import { LawyersModule } from '../lawyers/lawyers.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CasesResolver } from './resolvers/cases.resolver';
import { LawyersResolver } from './resolvers/lawyers.resolver';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
    LawyersModule,
    CasesModule,
    PrismaModule,
  ],
  providers: [LawyersResolver, CasesResolver],
})
export class GraphQLModule {}
