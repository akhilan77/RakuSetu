import { Request, Response } from 'express';
import { requestService } from './request.service.js';
import { ok, created } from '../../utils/response.js';

export class RequestController {
  async create(req: Request, res: Response) {
    const recipientId = req.user?.id!;
    const data = await requestService.createRequest(recipientId, req.body);
    return created(res, data, 'Blood request created successfully');
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const data = await requestService.getRequestById(id);
    return ok(res, data);
  }
}
export const requestController = new RequestController();
