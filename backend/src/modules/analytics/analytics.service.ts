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

  async getDemandSummary(isDev: boolean) {
    const key = `analytics:demand:summary:${isDev}`;
    return analyticsCacheService.getOrSetCache(key, () => analyticsRepository.getDemandSummary());
  }

  async getBloodGroupDemand(isDev: boolean) {
    const key = `analytics:demand:blood-groups:${isDev}`;
    return analyticsCacheService.getOrSetCache(key, () => analyticsRepository.getBloodGroupDemand());
  }

  async getExecutiveOverview(isDev: boolean) {
    const key = `analytics:overview:${isDev}`;
    return analyticsCacheService.getOrSetCache(key, () => analyticsRepository.getExecutiveOverview());
  }
}
export const analyticsService = new AnalyticsService();
