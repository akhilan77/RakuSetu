import { AppError } from '../../middleware/error.js';
import { ErrorCode } from '../../constants/error-codes.js';

export class RequestService {
  async createRequest(_recipientId: string, _data: any) {
    throw new AppError(501, ErrorCode.NOT_IMPLEMENTED, 'Blood request creation is not implemented yet');
  }

  async getRequestById(_id: string) {
    throw new AppError(501, ErrorCode.NOT_IMPLEMENTED, 'Fetch blood request is not implemented yet');
  }
}
export const requestService = new RequestService();
