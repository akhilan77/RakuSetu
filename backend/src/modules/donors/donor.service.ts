import { AppError } from '../../middleware/error.js';
import { ErrorCode } from '../../constants/error-codes.js';

export class DonorService {
  async registerDonor(_data: any) {
    throw new AppError(501, ErrorCode.NOT_IMPLEMENTED, 'Donor registration is not implemented yet');
  }

  async updateAvailability(_userId: string, _status: string, _snoozeUntil?: string) {
    throw new AppError(501, ErrorCode.NOT_IMPLEMENTED, 'Availability update is not implemented yet');
  }

  async searchDonors(_lat: number, _lng: number, _radiusKm: number, _bloodGroup?: string) {
    throw new AppError(501, ErrorCode.NOT_IMPLEMENTED, 'Geo search is not implemented yet');
  }
}
export const donorService = new DonorService();
