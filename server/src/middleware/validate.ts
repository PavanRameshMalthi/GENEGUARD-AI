import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    const firstMessage = errorArray[0]?.msg || 'Validation failed';
    return res.status(400).json({
      success: false,
      message: firstMessage,
      errors: errorArray.map(err => ({
        field: 'path' in err ? err.path : (err as any).param,
        message: err.msg,
        value: (err as any).value
      }))
    });
  }
  next();
};