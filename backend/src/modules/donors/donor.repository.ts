import { prisma } from '../../lib/prisma.js';
import { CreateDonorInput, UpdateDonorInput } from './donor.types.js';

export class DonorRepository {
  async createDonorProfile(userId: string, data: CreateDonorInput) {
    // 1. Update user's name
    await prisma.user.update({
      where: { id: userId },
      data: { name: data.fullName },
    });

    // 2. Create the DonorProfile
    const profile = await prisma.donorProfile.create({
      data: {
        userId,
        bloodGroup: data.bloodGroup,
        gender: data.gender,
        dob: data.dob,
        weight: data.weight,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        district: data.district,
        state: data.state,
      },
    });

    // 3. Update the PostGIS geography location Point
    await prisma.$executeRawUnsafe(
      `UPDATE "DonorProfile" SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE id = $3`,
      data.longitude,
      data.latitude,
      profile.id
    );

    return profile;
  }

  async getDonorProfileByUserId(userId: string) {
    return prisma.donorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });
  }

  async updateDonorProfile(userId: string, data: UpdateDonorInput) {
    // 1. Update user name if provided
    if (data.fullName) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: data.fullName },
      });
    }

    // 2. Update DonorProfile columns
    const updateData: Record<string, unknown> = {};
    if (data.bloodGroup) updateData.bloodGroup = data.bloodGroup;
    if (data.gender) updateData.gender = data.gender;
    if (data.dob) updateData.dob = data.dob;
    if (data.weight) updateData.weight = data.weight;
    if (data.city) updateData.city = data.city;
    if (data.district) updateData.district = data.district;
    if (data.state) updateData.state = data.state;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;

    const profile = await prisma.donorProfile.update({
      where: { userId },
      data: updateData,
    });

    // 3. Update location POINT if coordinates changed
    if (data.latitude !== undefined && data.longitude !== undefined) {
      await prisma.$executeRawUnsafe(
        `UPDATE "DonorProfile" SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE id = $3`,
        data.longitude,
        data.latitude,
        profile.id
      );
    }

    return profile;
  }

  async getDonorNumberInCity(city: string) {
    return prisma.donorProfile.count({
      where: {
        city: {
          equals: city,
          mode: 'insensitive',
        },
      },
    });
  }
}

export const donorRepository = new DonorRepository();
