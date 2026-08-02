import { Request, Response } from 'express';
import { donorService } from './donor.service.js';
import { createDonorSchema, updateDonorSchema } from './donor.types.js';
import { ok, created } from '../../utils/response.js';

export class DonorController {
  async registerDonor(req: Request, res: Response) {
    const userId = req.user!.id;
    const body = createDonorSchema.parse(req.body);
    const result = await donorService.registerDonor(userId, body);
    return created(res, result, 'Donor profile registered successfully');
  }

  async getMyProfile(req: Request, res: Response) {
    const userId = req.user!.id;
    const profile = await donorService.getMyProfile(userId);
    return ok(res, profile, 'Donor profile retrieved successfully');
  }

  async updateMyProfile(req: Request, res: Response) {
    const userId = req.user!.id;
    const body = updateDonorSchema.parse(req.body);
    const updated = await donorService.updateMyProfile(userId, body);
    return ok(res, updated, 'Donor profile updated successfully');
  }
}

export const donorController = new DonorController();
