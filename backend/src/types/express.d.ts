import { Role } from '@prisma/client';

export interface RequestUser {
  id: string;
  phone: string;
  roles: Role[];
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
