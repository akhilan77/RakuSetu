import { analyticsRepository } from './analytics.repository.js';
import { analyticsCacheService } from './cache/analytics.cache.js';

export class AnalyticsService {
  async getDonorSummary(isDev: boolean) {
    const key = `analytics:donors:summary:${isDev}`;
    return analyticsCacheService.getOrSetCache(key, () => analyticsRepository.getDonorSummary());
  }

  async getBloodGroupDistribution(isDev: boolean) {
    const key = `analytics:donors:blood-groups:${isDev}`;
    return analyticsCacheService.getOrSetCache(key, () => analyticsRepository.getBloodGroupDistribution());
  }

  async getEligibilitySummary(isDev: boolean) {
    const key = `analytics:donors:eligibility:${isDev}`;
    return analyticsCacheService.getOrSetCache(key, () => analyticsRepository.getEligibilitySummary());
  }

  async getGeographicDistribution(isDev: boolean) {
    const key = `analytics:donors:geography:${isDev}`;
    return analyticsCacheService.getOrSetCache(key, () => analyticsRepository.getGeographicDistribution());
  }

  async getRetentionStats(isDev: boolean) {
    const key = `analytics:donors:retention:${isDev}`;
    return analyticsCacheService.getOrSetCache(key, () => analyticsRepository.getRetentionStats());
  }

  async getMonthlyDonationTrends(isDev: boolean) {
    const key = `analytics:donors:monthly:${isDev}`;
    return analyticsCacheService.getOrSetCache(key, () => analyticsRepository.getMonthlyDonationTrends());
  }
}
export const analyticsService = new AnalyticsService();
