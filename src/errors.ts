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
    protected readonly logger: Logger;

    /**
     * Creates a new instance of BaseError.
     * 
     * @param {string} name - The name of the error.
     * @param {string} message - A descriptive error message.
     * @param {Logger} [logger] - Optional logger instance for logging error details.
     */

    constructor(name: string, message: string, logger?: Logger) {
        super(message);
        this.name = name;
        this.logger = logger || new Logger(name);
        Object.setPrototypeOf(this, new.target.prototype);
        this.log();
    }

    /**
     * Logs the error details.
     * 
     * @protected
     * @abstract
     */
    protected abstract log(): void;

    /**
     * Returns a string representation of the error.
     * 
     * @returns {string} A string representation of the error.
     */
    public toString(): string {
        return `${this.name}: ${this.message}`;
    }
}

/**
 * Represents an error that occurs during API communication.
 * Useful for handling HTTP request and response errors.
 * 
 * @extends BaseError
 */
export class ApiError extends BaseError {
    /**
     * Creates a new instance of ApiError.
     * 
     * @param {number} status - The HTTP status code associated with the error.
     * @param {string} message - A descriptive error message.
     * @param {string} [requestId] - Optional request ID for tracking purposes.
     */
    constructor(public readonly status: number, message: string, public readonly requestId?: string) {
        super('ApiError', message);
    }

    protected log(): void {
        this.logger.error(`API Error ${this.status}: ${this.message}${this.requestId ? ` (Request ID: ${this.requestId})` : ''}`);
    }
}

/**
 * Represents an error that occurs due to network-related issues.
 * 
 * @extends BaseError
 */
export class NetworkError extends BaseError {
    /**
     * Creates a new instance of NetworkError.
     * 
     * @param {string} message - A descriptive error message.
     * @param {string} [code] - Optional error code.
     */
    constructor(message: string, public readonly code?: string) {
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
     * @param {string} message - A descriptive error message.
     * @param {string} [source] - Optional source of the parsing error (e.g., 'JSON', 'XML').
     */
    constructor(message: string, public readonly source?: string) {
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
     * @param {string} message - A descriptive error message.
     * @param {string[]} [fields] - Optional array of field names that failed validation.
     */
    constructor(message: string, public readonly fields?: string[]) {
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
     * @param {string} message - A descriptive error message.
     * @param {string} [userId] - Optional user ID associated with the authentication attempt.
     */
    constructor(message: string, public readonly userId?: string) {
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
     * @param {string} message - A descriptive error message.
     * @param {string} [resource] - Optional resource that the user attempted to access.
     * @param {string} [action] - Optional action that the user attempted to perform.
     */
    constructor(message: string, public readonly resource?: string, public readonly action?: string) {
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
     * @param {string} message - A descriptive error message.
     * @param {number} [retryAfter] - Optional number of seconds after which the client can retry.
     */
    constructor(message: string, public readonly retryAfter?: number) {
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
     * @param {string} message - A descriptive error message.
     * @param {string} [operation] - Optional database operation that caused the error.
     */
    constructor(message: string, public readonly operation?: string) {
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
     * @param {string} message - A descriptive error message.
     * @param {string} [configKey] - Optional configuration key that caused the error.
     */
    constructor(message: string, public readonly configKey?: string) {
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
     * @param {string} message - A descriptive error message.
     * @param {string} serviceName - The name of the external service that failed.
     */
    constructor(message: string, public readonly serviceName: string) {
        super('ExternalServiceError', message);
    }

    protected log(): void {
        this.logger.error(`External Service Error (${this.serviceName}): ${this.message}`);
    }
}

/**
 * Represents an error that occurs when a file or directory is not found.
 * 
 * @extends BaseError
 */
export class FileNotFoundError extends BaseError {
    /**
     * Creates a new instance of FileNotFoundError.
     * 
     * @param {string} message - A descriptive error message.
     * @param {string} [path] - Optional path of the file or directory that was not found.
     */
    constructor(message: string, public readonly path?: string) {
        super('FileNotFoundError', message);
    }

    protected log(): void {
        this.logger.error(`File Not Found Error: ${this.message}${this.path ? ` (Path: ${this.path})` : ''}`);
    }
}

/**
 * Represents an error that occurs when a log directory does not exist.
 * 
 * @extends BaseError
 */
export class LogDirectoryNotFoundError extends BaseError {
    /**
     * Creates a new instance of LogDirectoryNotFoundError.
     * 
     * @param {string} message - A descriptive error message.
     * @param {string} directoryPath - The path of the log directory that was not found.
     */
    constructor(message: string, public readonly directoryPath: string) {
        super('LogDirectoryNotFoundError', message);
    }

    protected log(): void {
        this.logger.error(`Log Directory Not Found Error: ${this.message} (Directory: ${this.directoryPath})`);
    }
}

/**
 * Represents an error that occurs when there's an issue with log file operations.
 * 
 * @extends BaseError
 */
export class LogFileOperationError extends BaseError {
    /**
     * Creates a new instance of LogFileOperationError.
     * 
     * @param {string} message - A descriptive error message.
     * @param {string} filePath - The path of the log file that caused the error.
     * @param {string} [operation] - Optional description of the operation that failed.
     */
    constructor(message: string, public readonly filePath: string, public readonly operation?: string) {
        super('LogFileOperationError', message);
    }

    protected log(): void {
        this.logger.error(`Log File Operation Error: ${this.message} (File: ${this.filePath}${this.operation ? `, Operation: ${this.operation}` : ''})`);
    }
}

/**
 * Represents an error that occurs when there's an issue with logger initialization.
 * 
 * @extends BaseError
 */
export class LoggerInitializationError extends BaseError {
    /**
     * Creates a new instance of LoggerInitializationError.
     * 
     * @param {string} message - A descriptive error message.
     * @param {string} [component] - Optional description of the component that failed to initialize.
     */
    constructor(message: string, public readonly component?: string) {
        super('LoggerInitializationError', message);
    }

    protected log(): void {
        this.logger.error(`Logger Initialization Error: ${this.message}${this.component ? ` (Component: ${this.component})` : ''}`);
    }
}
