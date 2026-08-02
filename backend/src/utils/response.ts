import { Response } from 'express';

export function ok(res: Response, data: any = {}, message?: string, meta?: any) {
  return res.status(200).json({
    success: true,
    data,
    message,
    meta,
  });
}

export function created(res: Response, data: any = {}, message?: string) {
  return res.status(201).json({
    success: true,
    data,
    message,
  });
}

export function noContent(res: Response) {
  return res.status(204).send();
}

export function fail(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details: Record<string, any> = {}
) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
  });
}
