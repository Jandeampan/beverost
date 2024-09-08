/**
 * @module index
 * @description This module exports error classes, Logger functionality, ApiService, and a custom middleware.
 */

export * from './customerror';
export * from './errors';
export * from './logger';
export * from './api';

import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  timestamp?: string;
}

export function beverost(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    // Add a timestamp to the request
    req.timestamp = new Date().toISOString();

    // Log the incoming request
    console.log(`[${req.timestamp}] ${req.method} ${req.url}`);

    // Add a custom header to the response
    res.setHeader('X-Powered-By', 'Beverost Middleware');

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware
    next(error);
  }
}
