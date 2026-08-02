import { prisma } from '../lib/prisma.js';
import { Prisma } from '@prisma/client';

export class RequestRepository {
  async findById(id: string) {
    return prisma.bloodRequest.findUnique({
      where: { id },
      include: { recipient: true, institution: true },
    });
  }

  async create(data: Prisma.BloodRequestUncheckedCreateInput) {
    return prisma.bloodRequest.create({
      data,
    });
  }

  async update(id: string, data: Prisma.BloodRequestUpdateInput) {
    return prisma.bloodRequest.update({
      where: { id },
      data,
    });
  }

  async listActiveRequests() {
    return prisma.bloodRequest.findMany({
      where: {
        status: 'SEARCHING',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
export const requestRepository = new RequestRepository();
