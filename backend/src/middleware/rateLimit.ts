import { Request, Response, NextFunction } from 'express';
import { redis } from '../lib/redis.js';
import { AppError } from './error.js';
import { ErrorCode } from '../constants/error-codes.js';

export function redisRateLimiter(
  keyGenerator: (req: Request) => string,
  limit: number,
  windowSeconds: number,
  message: string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const countStr = await redis.get(key);

    if (countStr !== null) {
      const count = parseInt(countStr, 10);
      if (count >= limit) {
        throw new AppError(429, ErrorCode.BAD_REQUEST, message);
      }
      await redis.incr(key);
    } else {
      await redis.set(key, 1, 'EX', windowSeconds);
    }
    next();
  };
}
