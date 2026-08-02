import { prisma } from '../lib/prisma.js';
import { Prisma } from '@prisma/client';

export class InstitutionRepository {
  async findById(id: string) {
    return prisma.institution.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.InstitutionCreateInput) {
    return prisma.institution.create({
      data,
    });
  }

  async listAll() {
    return prisma.institution.findMany();
  }
}
export const institutionRepository = new InstitutionRepository();
