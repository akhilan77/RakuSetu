import { Request, Response } from 'express';
import { analyticsService } from './analytics.service.js';
import { ok } from '../../utils/response.js';

const isDev = process.env.NODE_ENV !== 'production';
const getMeta = () => ({
  generatedAt: new Date().toISOString(),
  isDevData: isDev,
});

export class AnalyticsController {
  async getDonorSummary(_req: Request, res: Response) {
    const data = await analyticsService.getDonorSummary(isDev);
    return ok(res, data, 'Donor summary aggregated successfully', getMeta());
  }

  async getBloodGroupDistribution(_req: Request, res: Response) {
    const data = await analyticsService.getBloodGroupDistribution(isDev);
    return ok(res, data, 'Blood group distribution aggregated successfully', getMeta());
  }

  async getEligibilitySummary(_req: Request, res: Response) {
    const data = await analyticsService.getEligibilitySummary(isDev);
    return ok(res, data, 'Eligibility summary aggregated successfully', getMeta());
  }

  async getGeographicDistribution(_req: Request, res: Response) {
    const data = await analyticsService.getGeographicDistribution(isDev);
    return ok(res, data, 'Geographic distribution aggregated successfully', getMeta());
  }

  async getRetentionStats(_req: Request, res: Response) {
    const data = await analyticsService.getRetentionStats(isDev);
    return ok(res, data, 'Retention statistics aggregated successfully', getMeta());
  }

  async getMonthlyDonationTrends(_req: Request, res: Response) {
    const data = await analyticsService.getMonthlyDonationTrends(isDev);
    return ok(res, data, 'Monthly donation trends aggregated successfully', getMeta());
  }
}
export const analyticsController = new AnalyticsController();
