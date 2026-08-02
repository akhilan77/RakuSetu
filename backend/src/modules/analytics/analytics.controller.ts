import { Request, Response } from 'express';
import { analyticsService } from './analytics.service.js';
import { analyticsRepository } from './analytics.repository.js';
import { ok } from '../../utils/response.js';
import { DEV_DATA_THRESHOLD } from './analytics.constants.js';

const getMeta = async () => {
  const { totalDonors } = await analyticsRepository.getDonorSummary();
  const { totalRequests } = await analyticsRepository.getDemandSummary();
  const isDevData = totalDonors < DEV_DATA_THRESHOLD || totalRequests === 0;
  return {
    generatedAt: new Date().toISOString(),
    isDevData,
  };
};

const isDev = process.env.NODE_ENV !== 'production';

export class AnalyticsController {
  async getDonorSummary(_req: Request, res: Response) {
    const data = await analyticsService.getDonorSummary(isDev);
    const meta = await getMeta();
    return ok(res, data, 'Donor summary aggregated successfully', meta);
  }

  async getBloodGroupDistribution(_req: Request, res: Response) {
    const data = await analyticsService.getBloodGroupDistribution(isDev);
    const meta = await getMeta();
    return ok(res, data, 'Blood group distribution aggregated successfully', meta);
  }

  async getEligibilitySummary(_req: Request, res: Response) {
    const data = await analyticsService.getEligibilitySummary(isDev);
    const meta = await getMeta();
    return ok(res, data, 'Eligibility summary aggregated successfully', meta);
  }

  async getGeographicDistribution(_req: Request, res: Response) {
    const data = await analyticsService.getGeographicDistribution(isDev);
    const meta = await getMeta();
    return ok(res, data, 'Geographic distribution aggregated successfully', meta);
  }

  async getRetentionStats(_req: Request, res: Response) {
    const data = await analyticsService.getRetentionStats(isDev);
    const meta = await getMeta();
    return ok(res, data, 'Retention statistics aggregated successfully', meta);
  }

  async getMonthlyDonationTrends(_req: Request, res: Response) {
    const data = await analyticsService.getMonthlyDonationTrends(isDev);
    const meta = await getMeta();
    return ok(res, data, 'Monthly donation trends aggregated successfully', meta);
  }

  async getDemandSummary(_req: Request, res: Response) {
    const data = await analyticsService.getDemandSummary(isDev);
    const meta = await getMeta();
    return ok(res, data, 'Demand summary aggregated successfully', meta);
  }

  async getBloodGroupDemand(_req: Request, res: Response) {
    const data = await analyticsService.getBloodGroupDemand(isDev);
    const meta = await getMeta();
    return ok(res, data, 'Blood group demand aggregated successfully', meta);
  }

  async getExecutiveOverview(_req: Request, res: Response) {
    const data = await analyticsService.getExecutiveOverview(isDev);
    const meta = await getMeta();
    return ok(res, data, 'Executive overview aggregated successfully', meta);
  }
}
export const analyticsController = new AnalyticsController();
