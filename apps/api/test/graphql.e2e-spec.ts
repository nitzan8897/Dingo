import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('GraphQL API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Lawyers Queries', () => {
    it('should fetch all lawyers', () => {
      const query = `
        query {
          lawyers {
            id
            fullNameEn
            fullNameHe
            specialties
            yearsOfExperience
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('lawyers');
          expect(Array.isArray(res.body.data.lawyers)).toBe(true);
        });
    });

    it('should fetch lawyers with filters', () => {
      const query = `
        query GetLawyers($filter: LawyerFilterInput) {
          lawyers(filter: $filter) {
            id
            fullNameEn
            specialties
            yearsOfExperience
          }
        }
      `;

      const variables = {
        filter: {
          specialties: ['CRIMINAL'],
          minYearsOfExperience: 5,
        },
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('lawyers');
          expect(Array.isArray(res.body.data.lawyers)).toBe(true);
        });
    });

    it('should fetch a single lawyer by ID', () => {
      const query = `
        query GetLawyer($id: String!) {
          lawyer(id: $id) {
            id
            fullNameEn
            city {
              nameEn
              nameHe
            }
            profileCases {
              titleEn
              outcome
            }
            reviews {
              reviewerName
              rating
            }
          }
        }
      `;

      const variables = {
        id: 'some-lawyer-id',
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables })
        .expect(200);
    });

    it('should search lawyers by name', () => {
      const query = `
        query SearchLawyers($name: String!) {
          searchLawyers(name: $name) {
            id
            fullNameEn
            fullNameHe
          }
        }
      `;

      const variables = {
        name: 'John',
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('searchLawyers');
          expect(Array.isArray(res.body.data.searchLawyers)).toBe(true);
        });
    });
  });

  describe('Lawyers Mutations', () => {
    it('should create a new lawyer', () => {
      const mutation = `
        mutation CreateLawyer($input: CreateLawyerInput!) {
          createLawyer(input: $input) {
            id
            fullNameEn
            fullNameHe
            specialties
            yearsOfExperience
          }
        }
      `;

      const variables = {
        input: {
          fullNameEn: 'Test Lawyer',
          fullNameHe: 'עורך דין מבחן',
          bioEn: 'Test bio',
          bioHe: 'ביוגרפיה',
          cityId: 'existing-city-id',
          specialties: ['CRIMINAL', 'CIVIL'],
          yearsOfExperience: 5,
          ratingVector: {
            professionalism: 80,
            availability: 75,
            empathy: 85,
            cost: 70,
          },
        },
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables })
        .expect(200)
        .expect((res) => {
          if (!res.body.errors) {
            expect(res.body.data).toHaveProperty('createLawyer');
            expect(res.body.data.createLawyer).toHaveProperty('id');
          }
        });
    });
  });

  describe('Cases Queries', () => {
    it('should fetch all cases', () => {
      const query = `
        query {
          cases {
            id
            externalId
            title
            specialty
            result
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('cases');
          expect(Array.isArray(res.body.data.cases)).toBe(true);
        });
    });

    it('should fetch cases with filters', () => {
      const query = `
        query GetCases($filter: CaseFilterInput) {
          cases(filter: $filter) {
            id
            title
            specialty
            result
          }
        }
      `;

      const variables = {
        filter: {
          specialty: 'CRIMINAL',
          year: 2023,
        },
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('cases');
          expect(Array.isArray(res.body.data.cases)).toBe(true);
        });
    });

    it('should fetch a single case by external ID', () => {
      const query = `
        query GetCase($externalId: String!) {
          case(externalId: $externalId) {
            id
            externalId
            title
            specialty
          }
        }
      `;

      const variables = {
        externalId: 'some-external-id',
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables })
        .expect(200);
    });
  });

  describe('Cases Mutations', () => {
    it('should create a new case', () => {
      const mutation = `
        mutation CreateCase($input: CreateCaseInput!) {
          createCase(input: $input) {
            id
            externalId
            title
            specialty
            result
          }
        }
      `;

      const variables = {
        input: {
          externalId: 'test-ext-123',
          title: 'Test Case',
          specialty: 'CRIMINAL',
          result: 'DEFENCE_WON',
          judgeName: 'Test Judge',
          complexityScore: 0.5,
          rawText: 'Test case text',
          plaintiffLawyerIds: [],
          defendantLawyerIds: [],
          associatedLawyerIds: [],
        },
      };

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables })
        .expect(200)
        .expect((res) => {
          if (!res.body.errors) {
            expect(res.body.data).toHaveProperty('createCase');
            expect(res.body.data.createCase).toHaveProperty('id');
          }
        });
    });
  });

  describe('GraphQL Introspection', () => {
    it('should support introspection queries', () => {
      const query = `
        query {
          __schema {
            queryType {
              name
            }
            mutationType {
              name
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('__schema');
          expect(res.body.data.__schema.queryType.name).toBe('Query');
          expect(res.body.data.__schema.mutationType.name).toBe('Mutation');
        });
    });
  });
});
