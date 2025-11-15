import { PrismaClient, Lawyer } from '@prisma/client';

export class LawyerRepository {
  constructor(private prisma: PrismaClient) {}

  async findByName(name: string): Promise<Lawyer | null> {
    return this.prisma.lawyer.findFirst({
      where: {
        OR: [
          { fullNameEn: { contains: name, mode: 'insensitive' } },
          { fullNameHe: { contains: name, mode: 'insensitive' } },
        ],
      },
    });
  }

  async createPendingVerification(name: string): Promise<Lawyer> {
    return this.prisma.lawyer.create({
      data: {
        fullNameEn: name,
        fullNameHe: name,
        city: 'Pending Verification',
        specialties: [],
        yearsOfExperience: 0,
        ratingVector: {
          overall: 0,
          communication: 0,
          expertise: 0,
          efficiency: 0,
          professionalism: 0,
          availability: 0,
        },
      },
    });
  }
}
