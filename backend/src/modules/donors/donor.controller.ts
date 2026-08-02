import { Request, Response } from 'express';
import { donorService } from './donor.service.js';
import { ok, created } from '../../utils/response.js';

export class DonorController {
  async register(req: Request, res: Response) {
    const data = await donorService.registerDonor(req.body);
    return created(res, data, 'Donor registered successfully');
  }

  async updateAvailability(req: Request, res: Response) {
    const userId = req.user?.id!;
    const { status, snoozeUntil } = req.body;
    const data = await donorService.updateAvailability(userId, status, snoozeUntil);
    return ok(res, data, 'Availability updated successfully');
  }

  async search(req: Request, res: Response) {
    const { lat, lng, radiusKm, bloodGroup } = req.query as any;
    const data = await donorService.searchDonors(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radiusKm),
      bloodGroup
    );
    return ok(res, data);
  }
}
export const donorController = new DonorController();
