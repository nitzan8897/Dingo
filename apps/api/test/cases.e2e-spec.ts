import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';

describe('Cases E2E Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const testLawyer1 = {
    fullNameEn: 'Test Lawyer 1',
    fullNameHe: 'עורך דין טסט 1',
    city: 'Tel Aviv',
    specialties: ['CIVIL'],
    yearsOfExperience: 10,
    ratingVector: {
      professionalism: 0.8,
      availability: 0.7,
      empathy: 0.9,
      cost: 0.6,
    },
  };

  const testLawyer2 = {
    fullNameEn: 'Test Lawyer 2',
    fullNameHe: 'עורך דין טסט 2',
    city: 'Jerusalem',
    specialties: ['CRIMINAL'],
    yearsOfExperience: 15,
    ratingVector: {
      professionalism: 0.9,
      availability: 0.8,
      empathy: 0.7,
      cost: 0.5,
    },
  };

  let lawyer1Id: string;
  let lawyer2Id: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    app.setGlobalPrefix('v1');

    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);

    // Clean up database before tests
    await prismaService.case.deleteMany({});
    await prismaService.lawyer.deleteMany({});

    // Create test lawyers
    const createdLawyer1 = await prismaService.lawyer.create({
      data: testLawyer1,
    });
    lawyer1Id = createdLawyer1.id;

    const createdLawyer2 = await prismaService.lawyer.create({
      data: testLawyer2,
    });
    lawyer2Id = createdLawyer2.id;
  });

  afterAll(async () => {
    // Clean up database after tests
    await prismaService.case.deleteMany({});
    await prismaService.lawyer.deleteMany({});
    await app.close();
  });

  describe('POST /v1/cases', () => {
    it('should create a new case with valid lawyer IDs', async () => {
      const createCaseDto = {
        externalId: 'TEST-CASE-001',
        title: 'Test Case vs. Defendant',
        specialty: 'CIVIL',
        result: 'win',
        judgeName: 'Judge Test',
        openedAt: '2024-01-15T00:00:00Z',
        closedAt: '2024-06-20T00:00:00Z',
        complexityScore: 0.7,
        rawText: 'Test case text',
        plaintiffLawyerIds: [lawyer1Id],
        defendantLawyerIds: [lawyer2Id],
        associatedLawyerIds: [],
      };

      const response = await request(app.getHttpServer())
        .post('/v1/cases')
        .send(createCaseDto)
        .expect(201);

      expect(response.body).toMatchObject({
        externalId: 'TEST-CASE-001',
        title: 'Test Case vs. Defendant',
        specialty: 'CIVIL',
        result: 'win',
        plaintiffLawyerIds: [lawyer1Id],
        defendantLawyerIds: [lawyer2Id],
      });
      expect(response.body.id).toBeDefined();
    });

    it('should update existing case when externalId already exists', async () => {
      const updateCaseDto = {
        externalId: 'TEST-CASE-001',
        title: 'Updated Test Case Title',
        specialty: 'CIVIL',
        result: 'settlement',
        complexityScore: 0.8,
        rawText: 'Updated case text',
        plaintiffLawyerIds: [lawyer1Id],
        defendantLawyerIds: [lawyer2Id],
        associatedLawyerIds: [],
      };

      const response = await request(app.getHttpServer())
        .post('/v1/cases')
        .send(updateCaseDto)
        .expect(201);

      expect(response.body.title).toBe('Updated Test Case Title');
      expect(response.body.result).toBe('settlement');
      expect(response.body.complexityScore).toBe(0.8);
    });

    it('should reject case creation with invalid plaintiff lawyer ID', async () => {
      const createCaseDto = {
        externalId: 'TEST-CASE-002',
        title: 'Invalid Lawyer Case',
        specialty: 'CIVIL',
        result: 'win',
        complexityScore: 0.5,
        rawText: 'Test text',
        plaintiffLawyerIds: ['non-existent-lawyer-id'],
        defendantLawyerIds: [lawyer2Id],
        associatedLawyerIds: [],
      };

      const response = await request(app.getHttpServer())
        .post('/v1/cases')
        .send(createCaseDto)
        .expect(400);

      expect(response.body.message).toContain('non-existent-lawyer-id');
    });

    it('should reject case creation with invalid defendant lawyer ID', async () => {
      const createCaseDto = {
        externalId: 'TEST-CASE-003',
        title: 'Invalid Defendant Case',
        specialty: 'CIVIL',
        result: 'win',
        complexityScore: 0.5,
        rawText: 'Test text',
        plaintiffLawyerIds: [lawyer1Id],
        defendantLawyerIds: ['invalid-defendant-id'],
        associatedLawyerIds: [],
      };

      const response = await request(app.getHttpServer())
        .post('/v1/cases')
        .send(createCaseDto)
        .expect(400);

      expect(response.body.message).toContain('invalid-defendant-id');
    });

    it('should reject case creation with multiple invalid lawyer IDs', async () => {
      const createCaseDto = {
        externalId: 'TEST-CASE-004',
        title: 'Multiple Invalid Lawyers',
        specialty: 'CIVIL',
        result: 'win',
        complexityScore: 0.5,
        rawText: 'Test text',
        plaintiffLawyerIds: ['invalid-id-1'],
        defendantLawyerIds: ['invalid-id-2'],
        associatedLawyerIds: ['invalid-id-3'],
      };

      const response = await request(app.getHttpServer())
        .post('/v1/cases')
        .send(createCaseDto)
        .expect(400);

      expect(response.body.message).toContain('invalid-id-1');
      expect(response.body.message).toContain('invalid-id-2');
      expect(response.body.message).toContain('invalid-id-3');
    });

    it('should accept case creation with no lawyers', async () => {
      const createCaseDto = {
        externalId: 'TEST-CASE-005',
        title: 'No Lawyers Case',
        specialty: 'CIVIL',
        result: 'dismissed',
        complexityScore: 0.3,
        rawText: 'Case with no lawyers',
        plaintiffLawyerIds: [],
        defendantLawyerIds: [],
        associatedLawyerIds: [],
      };

      const response = await request(app.getHttpServer())
        .post('/v1/cases')
        .send(createCaseDto)
        .expect(201);

      expect(response.body.externalId).toBe('TEST-CASE-005');
      expect(response.body.plaintiffLawyerIds).toEqual([]);
    });

    it('should reject case with invalid result enum', async () => {
      const createCaseDto = {
        externalId: 'TEST-CASE-006',
        title: 'Invalid Result',
        specialty: 'CIVIL',
        result: 'invalid-result',
        complexityScore: 0.5,
        rawText: 'Test text',
        plaintiffLawyerIds: [],
        defendantLawyerIds: [],
        associatedLawyerIds: [],
      };

      await request(app.getHttpServer())
        .post('/v1/cases')
        .send(createCaseDto)
        .expect(400);
    });

    it('should reject case with complexity score out of range', async () => {
      const createCaseDto = {
        externalId: 'TEST-CASE-007',
        title: 'Invalid Complexity',
        specialty: 'CIVIL',
        result: 'win',
        complexityScore: 1.5,
        rawText: 'Test text',
        plaintiffLawyerIds: [],
        defendantLawyerIds: [],
        associatedLawyerIds: [],
      };

      await request(app.getHttpServer())
        .post('/v1/cases')
        .send(createCaseDto)
        .expect(400);
    });

    it('should reject case with missing required fields', async () => {
      const createCaseDto = {
        externalId: 'TEST-CASE-008',
        title: 'Missing Fields',
        // Missing specialty, result, complexityScore, rawText
      };

      await request(app.getHttpServer())
        .post('/v1/cases')
        .send(createCaseDto)
        .expect(400);
    });
  });

  describe('GET /v1/cases', () => {
    it('should return all cases', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/cases')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /v1/cases/:externalId', () => {
    it('should return a case by externalId', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/cases/TEST-CASE-001')
        .expect(200);

      expect(response.body.externalId).toBe('TEST-CASE-001');
      expect(response.body.title).toBeDefined();
    });

    it('should return null for non-existent externalId', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/cases/NON-EXISTENT-CASE')
        .expect(200);

      expect(response.body).toBeNull();
    });
  });
});
