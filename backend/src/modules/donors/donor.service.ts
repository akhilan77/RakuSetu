import { donorRepository } from './donor.repository.js';
import { eligibilityService } from './eligibility.service.js';
import { analyticsCacheService } from '../analytics/cache/analytics.cache.js';
import { CreateDonorInput, UpdateDonorInput } from './donor.types.js';
import { AppError } from '../../middleware/error.js';
import { ErrorCode } from '../../constants/error-codes.js';
import { DonorStatus } from '@prisma/client';

export class DonorService {
  async registerDonor(userId: string, data: CreateDonorInput) {
    // 1. Application-level presence check
    const existing = await donorRepository.getDonorProfileByUserId(userId);
    if (existing) {
      throw new AppError(409, ErrorCode.CONFLICT, 'User already has a registered donor profile');
    }

    const eligibility = eligibilityService.calculateEligibility(data.dob, data.weight);

    try {
      const profile = await donorRepository.createDonorProfile(userId, data);
      
      // Update status in db if deferred
      if (eligibility !== 'ELIGIBLE') {
        await donorRepository.updateDonorProfile(userId, {
          status: DonorStatus.INELIGIBLE,
        } as unknown as UpdateDonorInput);
      }

      // 2. Selectively invalidate analytics caches
      await analyticsCacheService.invalidateDonorAnalytics();
      await analyticsCacheService.invalidateOverviewAnalytics();

      const donorNumberInCity = await donorRepository.getDonorNumberInCity(data.city);

      return {
        donorId: profile.id,
        eligibility,
        donorNumberInCity,
      };
    } catch (error: any) {
      // 3. Database unique constraint violation handler (P2002)
      if (error.code === 'P2002') {
        throw new AppError(409, ErrorCode.CONFLICT, 'User already has a registered donor profile');
      }
      throw error;
    }
  }

  async getMyProfile(userId: string) {
    const profile = await donorRepository.getDonorProfileByUserId(userId);
    if (!profile) {
      throw new AppError(404, ErrorCode.NOT_FOUND, 'Donor profile not found');
    }
    return profile;
  }

  async updateMyProfile(userId: string, data: UpdateDonorInput) {
    const profile = await donorRepository.getDonorProfileByUserId(userId);
    if (!profile) {
      throw new AppError(404, ErrorCode.NOT_FOUND, 'Donor profile not found');
    }

    const updated = await donorRepository.updateDonorProfile(userId, data);

    // Recalculate eligibility if relevant fields changed
    if (data.dob || data.weight) {
      const dob = data.dob || profile.dob;
      const weight = data.weight || profile.weight;
      const eligibility = eligibilityService.calculateEligibility(dob, weight);
      
      await donorRepository.updateDonorProfile(userId, {
        status: eligibility === 'ELIGIBLE' ? DonorStatus.AVAILABLE : DonorStatus.INELIGIBLE,
      } as unknown as UpdateDonorInput);
    }

    // Invalidate caches
    await analyticsCacheService.invalidateDonorAnalytics();
    await analyticsCacheService.invalidateOverviewAnalytics();

    return updated;
  }
}

export const donorService = new DonorService();
