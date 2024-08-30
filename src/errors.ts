/**
  * @module errors
  * @description This module contains custom error classes for handling various types of errors in the application.
  */

import { Logger } from './logger';

/**
  * Base class for custom errors in the application.
  * Provides common functionality for logging and error details.
  * 
  * @abstract
  * @extends Error
  */
abstract class BaseError extends Error {

    /**
      * Creates a new instance of BaseError.
      * 
      * @param {string} name - The name of the error.
      * @param {string} message - A descriptive error message.
      */
    constructor(name: string, message: string, protected logger: Logger = new Logger(name)) {
        super(message);
        this.name = name;
        this.log();
    }

    /**
      * Logs the error details.
      * 
      * @protected
      * @abstract
      */
    protected abstract log(): void;
}

/**
  * Represents an error that occurs during API communication.
  * This class is particularly useful when dealing with HTTP requests and responses.
  * 
  * @extends BaseError
  */
export class ApiError extends BaseError {
    /**
      * Creates a new instance of ApiError.
      * 
      * @param {number} status - The HTTP status code associated with the error.
      * @param {string} message - A descriptive error message providing more details about the API error.
      * @param {string} [requestId] - Optional request ID for tracking purposes.
      */
    constructor(public status: number, message: string, public requestId?: string) {
        super('ApiError', message);
    }

    protected log(): void {
        this.logger.error(`API Error ${this.status}: ${this.message}${this.requestId ? ` (Request ID: ${this.requestId})` : ''}`);
    }
}

/**
  * Represents an error that occurs due to network-related issues.
  * Useful for handling errors such as connection timeouts, DNS failures, offline status, etc.
  * 
  * @extends BaseError
  */
export class NetworkError extends BaseError {
    /**
      * Creates a new instance of NetworkError.
      * 
      * @param {string} message - A descriptive error message providing details about the network issue.
      * @param {string} [code] - Optional error code for more specific categorization.
      */
    constructor(message: string, public code?: string) {
        super('NetworkError', message);
    }

    protected log(): void {
        this.logger.error(`Network Error${this.code ? ` (${this.code})` : ''}: ${this.message}`);
    }
}

/**
  * Represents an error that occurs during parsing operations.
  * 
  * @extends BaseError
  */
export class ParseError extends BaseError {
    /**
      * Creates a new instance of ParseError.
      * 
      * @param {string} message - A descriptive error message providing details about the parsing issue.
      * @param {string} [source] - Optional source of the parsing error (e.g., 'JSON', 'XML').
      */
    constructor(message: string, public source?: string) {
        super('ParseError', message);
    }

    protected log(): void {
        this.logger.error(`Parse Error${this.source ? ` in ${this.source}` : ''}: ${this.message}`);
    }
}

/**
  * Represents an error that occurs due to validation failures.
  * 
  * @extends BaseError
  */
export class ValidationError extends BaseError {
    /**
      * Creates a new instance of ValidationError.
      * 
      * @param {string} message - A descriptive error message providing details about the validation issue.
      * @param {string[]} [fields] - Optional array of field names that failed validation.
      */
    constructor(message: string, public fields?: string[]) {
        super('ValidationError', message);
    }

    protected log(): void {
        this.logger.error(`Validation Error: ${this.message}${this.fields ? ` (Fields: ${this.fields.join(', ')})` : ''}`);
    }
}

/**
  * Represents an error that occurs due to authentication failures.
  * 
  * @extends BaseError
  */
export class AuthenticationError extends BaseError {
    /**
      * Creates a new instance of AuthenticationError.
      * 
      * @param {string} message - A descriptive error message providing details about the authentication issue.
      * @param {string} [userId] - Optional user ID associated with the authentication attempt.
      */
    constructor(message: string, public userId?: string) {
        super('AuthenticationError', message);
    }

    protected log(): void {
        this.logger.error(`Authentication Error: ${this.message}${this.userId ? ` (User ID: ${this.userId})` : ''}`);
    }
}

/**
  * Represents an error that occurs due to authorization failures.
  * 
  * @extends BaseError
  */
export class AuthorizationError extends BaseError {
    /**
      * Creates a new instance of AuthorizationError.
      * 
      * @param {string} message - A descriptive error message providing details about the authorization issue.
      * @param {string} [resource] - Optional resource that the user attempted to access.
      * @param {string} [action] - Optional action that the user attempted to perform.
      */
    constructor(message: string, public resource?: string, public action?: string) {
        super('AuthorizationError', message);
    }

    protected log(): void {
        this.logger.error(`Authorization Error: ${this.message}${this.resource ? ` (Resource: ${this.resource})` : ''}${this.action ? ` (Action: ${this.action})` : ''}`);
    }
}

/**
  * Represents an error that occurs due to rate limiting.
  * 
  * @extends BaseError
  */
export class RateLimitError extends BaseError {
    /**
      * Creates a new instance of RateLimitError.
      * 
      * @param {string} message - A descriptive error message providing details about the rate limiting issue.
      * @param {number} [retryAfter] - Optional number of seconds after which the client can retry.
      */
    constructor(message: string, public retryAfter?: number) {
        super('RateLimitError', message);
    }

    protected log(): void {
        this.logger.error(`Rate Limit Error: ${this.message}${this.retryAfter ? ` (Retry After: ${this.retryAfter}s)` : ''}`);
    }
}

/**
  * Represents an error that occurs due to database operations.
  * 
  * @extends BaseError
  */
export class DatabaseError extends BaseError {
    /**
      * Creates a new instance of DatabaseError.
      * 
      * @param {string} message - A descriptive error message providing details about the database issue.
      * @param {string} [operation] - Optional database operation that caused the error.
      */
    constructor(message: string, public operation?: string) {
        super('DatabaseError', message);
    }

    protected log(): void {
        this.logger.error(`Database Error: ${this.message}${this.operation ? ` (Operation: ${this.operation})` : ''}`);
    }
}

/**
  * Represents an error that occurs due to configuration issues.
  * 
  * @extends BaseError
  */
export class ConfigurationError extends BaseError {
    /**
      * Creates a new instance of ConfigurationError.
      * 
      * @param {string} message - A descriptive error message providing details about the configuration issue.
      * @param {string} [configKey] - Optional configuration key that caused the error.
      */
    constructor(message: string, public configKey?: string) {
        super('ConfigurationError', message);
    }

    protected log(): void {
        this.logger.error(`Configuration Error: ${this.message}${this.configKey ? ` (Config Key: ${this.configKey})` : ''}`);
    }
}

/**
  * Represents an error that occurs due to external service failures.
  * 
  * @extends BaseError
  */
export class ExternalServiceError extends BaseError {
    /**
      * Creates a new instance of ExternalServiceError.
      * 
      * @param {string} message - A descriptive error message providing details about the external service issue.
      * @param {string} serviceName - The name of the external service that failed.
      */
    constructor(message: string, public serviceName: string) {
        super('ExternalServiceError', message);
    }

    protected log(): void {
        this.logger.error(`External Service Error (${this.serviceName}): ${this.message}`);
    }
}
