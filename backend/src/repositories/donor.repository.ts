import { prisma } from '../lib/prisma.js';
import { Prisma } from '@prisma/client';

export class DonorRepository {
  async findByUserId(userId: string) {
    return prisma.donorProfile.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async create(data: Prisma.DonorProfileUncheckedCreateInput) {
    return prisma.donorProfile.create({
      data,
    });
  }

  async update(id: string, data: Prisma.DonorProfileUpdateInput) {
    return prisma.donorProfile.update({
      where: { id },
      data,
    });
  }

  async searchNearby(_longitude: number, _latitude: number, _radiusKm: number, _bloodGroup?: string) {
    // Geo-query placeholder for PostGIS ST_DWithin query.
    // Real implementation of Day 12 will use this repository call.
    return prisma.$queryRaw`
      SELECT dp.* FROM "DonorProfile" dp
      WHERE dp.status = 'AVAILABLE'
    `;
  }
}
export const donorRepository = new DonorRepository();
