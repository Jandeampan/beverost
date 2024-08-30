/**
 * @module index
 * @description This module exports error classes and Logger functionality.
 */

import {
    ApiError,
    NetworkError,
    ParseError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    RateLimitError,
    DatabaseError,
    ConfigurationError,
    ExternalServiceError
} from './errors';
import { Logger } from './logger';

/**
 * Export all error classes and Logger
 */
export {
    ApiError,
    NetworkError,
    ParseError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    RateLimitError,
    DatabaseError,
    ConfigurationError,
    ExternalServiceError,
    Logger
};
