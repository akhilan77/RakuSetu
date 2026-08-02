import { prisma } from '../lib/prisma.js';
import { Prisma } from '@prisma/client';

export class MatchRepository {
  async findById(id: string) {
    return prisma.match.findUnique({
      where: { id },
      include: { request: true, donor: true },
    });
  }

  async create(data: Prisma.MatchUncheckedCreateInput) {
    return prisma.match.create({
      data,
    });
  }

  async updateStatus(id: string, status: any) {
    return prisma.match.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }
}
export const matchRepository = new MatchRepository();
