import { prisma } from '../../lib/prisma.js';
import { BloodGroup } from '@prisma/client';

export class AnalyticsRepository {
  async getDonorSummary() {
    const totalDonors = await prisma.donorProfile.count();
    return { totalDonors };
  }

  async getBloodGroupDistribution() {
    const totalDonors = await prisma.donorProfile.count();
    const groups = await prisma.donorProfile.groupBy({
      by: ['bloodGroup'],
      _count: {
        id: true,
      },
    });

    // Preset list of all groups to return 0 counts cleanly
    const allGroups = Object.values(BloodGroup);
    return allGroups.map((bg) => {
      const found = groups.find((g) => g.bloodGroup === bg);
      const count = found?._count.id || 0;
      const percentage = totalDonors > 0 ? parseFloat(((count / totalDonors) * 100).toFixed(2)) : 0;
      return {
        bloodGroup: bg,
        count,
        percentage,
      };
    });
  }

  async getEligibilitySummary() {
    const totalDonors = await prisma.donorProfile.count();
    const now = new Date();
    
    // Eligible means nextEligibleAt is null or in the past
    const eligibleCount = await prisma.donorProfile.count({
      where: {
        OR: [
          { nextEligibleAt: null },
          { nextEligibleAt: { lte: now } }
        ]
      }
    });

    const deferredCount = totalDonors - eligibleCount;

    return [
      {
        status: 'Eligible',
        count: eligibleCount,
        percentage: totalDonors > 0 ? parseFloat(((eligibleCount / totalDonors) * 100).toFixed(2)) : 0,
      },
      {
        status: 'Deferred',
        count: deferredCount,
        percentage: totalDonors > 0 ? parseFloat(((deferredCount / totalDonors) * 100).toFixed(2)) : 0,
      }
    ];
  }

  async getGeographicDistribution() {
    const groups = await prisma.donorProfile.groupBy({
      by: ['city', 'district', 'state'],
      _count: {
        id: true,
      },
    });

    return groups.map((g) => ({
      city: g.city || 'Unknown City',
      district: g.district || 'Unknown District',
      state: g.state || 'Unknown State',
      count: g._count.id,
    }));
  }

  async getRetentionStats() {
    const uniqueDonorsCount = await prisma.donorProfile.count();
    
    // Count donations grouped by donorId
    const donationsGrouped = await prisma.donation.groupBy({
      by: ['donorId'],
      _count: {
        id: true,
      },
    });

    let firstTimeDonors = 0;
    let repeatDonors = 0;
    let totalDonations = 0;

    donationsGrouped.forEach((group) => {
      const count = group._count.id;
      totalDonations += count;
      if (count === 1) {
        firstTimeDonors++;
      } else if (count > 1) {
        repeatDonors++;
      }
    });

    const averageDonations = uniqueDonorsCount > 0 ? parseFloat((totalDonations / uniqueDonorsCount).toFixed(2)) : 0;
    const retentionRate = uniqueDonorsCount > 0 ? parseFloat(((repeatDonors / uniqueDonorsCount) * 100).toFixed(2)) : 0;

    return {
      firstTimeDonors,
      repeatDonors,
      averageDonations,
      retentionRate,
    };
  }

  async getMonthlyDonationTrends() {
    // Aggregating donation trends over the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const donations = await prisma.donation.findMany({
      where: {
        donatedAt: {
          gte: twelveMonthsAgo,
        },
      },
      select: {
        donatedAt: true,
        donorId: true,
      },
    });

    // Grouping locally to avoid DB SQL complexity
    const monthlyGroups: Record<string, { count: number; uniqueDonors: Set<string> }> = {};

    donations.forEach((d) => {
      const date = new Date(d.donatedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = { count: 0, uniqueDonors: new Set() };
      }
      monthlyGroups[monthKey].count++;
      monthlyGroups[monthKey].uniqueDonors.add(d.donorId);
    });

    // Create a chronological list of last 12 months
    const trends = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const data = monthlyGroups[monthKey];
      trends.push({
        month: monthKey,
        donationCount: data ? data.count : 0,
        uniqueDonors: data ? data.uniqueDonors.size : 0,
      });
    }

    return trends;
  }

  async getDemandSummary() {
    const totalRequests = await prisma.bloodRequest.count();
    const activeRequests = await prisma.bloodRequest.count({
      where: {
        status: {
          in: ['CREATED', 'SEARCHING', 'MATCHED'],
        },
      },
    });
    const fulfilledRequests = await prisma.bloodRequest.count({
      where: {
        status: 'FULFILLED',
      },
    });
    const cancelledRequests = await prisma.bloodRequest.count({
      where: {
        status: 'CANCELLED',
      },
    });

    return {
      totalRequests,
      activeRequests,
      fulfilledRequests,
      cancelledRequests,
    };
  }

  async getBloodGroupDemand() {
    const totalRequests = await prisma.bloodRequest.count();
    const groups = await prisma.bloodRequest.groupBy({
      by: ['requiredBloodGroup'],
      _count: {
        id: true,
      },
    });

    const allGroups = Object.values(BloodGroup);
    return allGroups.map((bg) => {
      const found = groups.find((g) => g.requiredBloodGroup === bg);
      const count = found?._count.id || 0;
      const percentage = totalRequests > 0 ? parseFloat(((count / totalRequests) * 100).toFixed(2)) : 0;
      return {
        bloodGroup: bg,
        requests: count,
        percentage,
      };
    });
  }

  async getExecutiveOverview() {
    const donors = await this.getDonorSummary();
    const requests = await this.getDemandSummary();
    return {
      donors,
      requests,
    };
  }
}
export const analyticsRepository = new AnalyticsRepository();
