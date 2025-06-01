import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {AppError} from './errorHandler';
import pool from '../config/database';

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    ) as JwtPayload;

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [
      decoded.id,
    ]);

    if (!result.rows[0]) {
      return next(new AppError('User not found', 404));
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401));
  }
};
