/**
 * @module errors
 * @description This module contains custom error classes for handling various types of errors in the application.
 * Each error class extends the CustomError class and provides specific functionality for different error scenarios.
 * 
 * The module includes the following error classes:
 * - ApiError: Represents errors that occur during API operations.
 * - NetworkError: Represents errors that occur during network operations.
 * - ParseError: Represents errors that occur during parsing operations.
 * - ValidationError: Represents errors that occur during data validation.
 * - AuthenticationError: Represents errors that occur during authentication.
 * - AuthorizationError: Represents errors that occur during authorization.
 * - RateLimitError: Represents errors that occur when a rate limit is exceeded.
 * - DatabaseError: Represents errors that occur during database operations.
 * - ConfigurationError: Represents errors that occur due to configuration issues.
 * - ExternalServiceError: Represents errors that occur when interacting with an external service.
 * - FileNotFoundError: Represents errors that occur when a file is not found.
 * - LogDirectoryNotFoundError: Represents errors that occur when a log directory is not found.
 * - LogFileOperationError: Represents errors that occur during log file operations.
 * - LoggerInitializationError: Represents errors that occur during logger initialization.
 * 
 * These custom error classes allow for more precise error handling and logging throughout the application.
 * They provide additional context and information specific to each error type, enhancing debugging and error reporting capabilities.
 * 
 * Each error class includes a constructor for creating instances with relevant error details and a log method for consistent error logging.
 */

import { CustomError } from './customerror';

/**
 * Represents an error that occurs during API operations.
 * @extends CustomError
 */
export class ApiError extends CustomError {
    /**
     * Creates an instance of ApiError.
     * @param {number} status - The HTTP status code associated with the error.
     * @param {string} message - The error message.
     * @param {string} [requestId] - The optional request ID associated with the API call.
     */
    constructor(public readonly status: number, message: string, public readonly requestId?: string) {
        super('ApiError', message);
    }

    /**
     * Logs the API error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    log(logger: any): void {
        logger.error(`API Error ${this.status}: ${this.message}${this.requestId ? ` (Request ID: ${this.requestId})` : ''}`);
    }
}

/**
 * Represents an error that occurs during network operations.
 * @extends CustomError
 */
export class NetworkError extends CustomError {
    /**
     * Creates an instance of NetworkError.
     * @param {string} message - The error message.
     * @param {string} [code] - The optional error code associated with the network error.
     */
    constructor(message: string, public readonly code?: string) {
        super('NetworkError', message);
    }

    /**
     * Logs the network error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    log(logger: any): void {
        logger.error(`Network Error${this.code ? ` (${this.code})` : ''}: ${this.message}`);
    }
}

/**
 * Represents an error that occurs during parsing operations.
 * @extends CustomError
 */
export class ParseError extends CustomError {
    /**
     * Creates an instance of ParseError.
     * @param {string} message - The error message.
     * @param {string} [source] - The optional source of the parsing error.
     */
    constructor(message: string, public readonly source?: string) {
        super('ParseError', message);
    }

    /**
     * Logs the parse error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    log(logger: any): void {
        logger.error(`Parse Error${this.source ? ` in ${this.source}` : ''}: ${this.message}`);
    }
}

/**
 * Represents an error that occurs during data validation.
 * @extends CustomError
 */
export class ValidationError extends CustomError {
    /**
     * Creates an instance of ValidationError.
     * @param {string} message - The error message.
     * @param {string[]} [fields] - The optional array of field names that failed validation.
     */
    constructor(message: string, public readonly fields?: string[]) {
        super('ValidationError', message);
    }

    /**
     * Logs the validation error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    log(logger: any): void {
        logger.error(`Validation Error: ${this.message}${this.fields ? ` (Fields: ${this.fields.join(', ')})` : ''}`);
    }
}

/**
 * Represents an error that occurs during authentication.
 * @extends CustomError
 */
export class AuthenticationError extends CustomError {
    /**
     * Creates an instance of AuthenticationError.
     * @param {string} message - The error message.
     * @param {string} [userId] - The optional user ID associated with the authentication error.
     */
    constructor(message: string, public readonly userId?: string) {
        super('AuthenticationError', message);
    }

    /**
     * Logs the authentication error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    log(logger: any): void {
        logger.error(`Authentication Error: ${this.message}${this.userId ? ` (User ID: ${this.userId})` : ''}`);
    }
}

/**
 * Represents an error that occurs during authorization.
 * @extends CustomError
 */
export class AuthorizationError extends CustomError {
    /**
     * Creates an instance of AuthorizationError.
     * @param {string} message - The error message.
     * @param {string} [resource] - The optional resource that the user is not authorized to access.
     * @param {string} [action] - The optional action that the user is not authorized to perform.
     */
    constructor(message: string, public readonly resource?: string, public readonly action?: string) {
        super('AuthorizationError', message);
    }

    /**
     * Logs the authorization error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    log(logger: any): void {
        logger.error(`Authorization Error: ${this.message}${this.resource ? ` (Resource: ${this.resource})` : ''}${this.action ? ` (Action: ${this.action})` : ''}`);
    }
}

/**
 * Represents an error that occurs when a rate limit is exceeded.
 * @extends CustomError
 */
export class RateLimitError extends CustomError {
    /**
     * Creates an instance of RateLimitError.
     * @param {string} message - The error message.
     * @param {number} [retryAfter] - The optional number of seconds after which the client can retry the request.
     */
    constructor(message: string, public readonly retryAfter?: number) {
        super('RateLimitError', message);
    }

    /**
     * Logs the rate limit error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    log(logger: any): void {
        logger.error(`Rate Limit Error: ${this.message}${this.retryAfter ? ` (Retry After: ${this.retryAfter}s)` : ''}`);
    }
}

/**
 * Represents an error that occurs during database operations.
 * @extends CustomError
 */
export class DatabaseError extends CustomError {
    /**
     * Creates an instance of DatabaseError.
     * @param {string} message - The error message.
     * @param {string} [operation] - The optional database operation that caused the error.
     */
    constructor(message: string, public readonly operation?: string) {
        super('DatabaseError', message);
    }

    /**
     * Logs the database error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    log(logger: any): void {
        logger.error(`Database Error: ${this.message}${this.operation ? ` (Operation: ${this.operation})` : ''}`);
    }
}

/**
 * Represents an error that occurs due to configuration issues.
 * @extends CustomError
 */
export class ConfigurationError extends CustomError {
    /**
     * Creates an instance of ConfigurationError.
     * @param {string} message - The error message.
     * @param {string} [configKey] - The optional configuration key that caused the error.
     */
    constructor(message: string, public readonly configKey?: string) {
        super('ConfigurationError', message);
    }

    /**
     * Logs the configuration error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    log(logger: any): void {
        logger.error(`Configuration Error: ${this.message}${this.configKey ? ` (Config Key: ${this.configKey})` : ''}`);
    }
}

/**
 * Represents an error that occurs when interacting with an external service.
 * @extends CustomError
 */
export class ExternalServiceError extends CustomError {
    /**
     * Creates an instance of ExternalServiceError.
     * @param {string} message - The error message.
     * @param {string} serviceName - The name of the external service that caused the error.
     */
    constructor(message: string, public readonly serviceName: string) {
        super('ExternalServiceError', message);
    }

    /**
     * Logs the external service error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    log(logger: any): void {
        logger.error(`External Service Error (${this.serviceName}): ${this.message}`);
    }
}

/**
 * Represents an error that occurs when a file is not found.
 * @extends CustomError
 */
export class FileNotFoundError extends CustomError {
    /**
     * Creates an instance of FileNotFoundError.
     * @param {string} message - The error message.
     * @param {string} [path] - The optional file path that was not found.
     */
    constructor(message: string, public readonly path?: string) {
        super('FileNotFoundError', message);
    }

    /**
     * Logs the file not found error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    public log(logger: any): void {
        logger.error(`File Not Found Error: ${this.message}${this.path ? ` (Path: ${this.path})` : ''}`);
    }
}

/**
 * Represents an error that occurs when a log directory is not found.
 * @extends CustomError
 */
export class LogDirectoryNotFoundError extends CustomError {
    /**
     * Creates an instance of LogDirectoryNotFoundError.
     * @param {string} message - The error message.
     * @param {string} directoryPath - The path of the log directory that was not found.
     */
    constructor(message: string, public readonly directoryPath: string) {
        super('LogDirectoryNotFoundError', message);
    }

    /**
     * Logs the log directory not found error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    public log(logger: any): void {
        logger.error(`Log Directory Not Found Error: ${this.message} (Directory: ${this.directoryPath})`);
    }
}

/**
 * Represents an error that occurs during log file operations.
 * @extends CustomError
 */
export class LogFileOperationError extends CustomError {
    /**
     * Creates an instance of LogFileOperationError.
     * @param {string} message - The error message.
     * @param {string} filePath - The path of the log file that caused the error.
     * @param {string} [operation] - The optional operation that was being performed on the log file.
     */
    constructor(message: string, public readonly filePath: string, public readonly operation?: string) {
        super('LogFileOperationError', message);
    }

    /**
     * Logs the log file operation error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    public log(logger: any): void {
        logger.error(`Log File Operation Error: ${this.message} (File: ${this.filePath}${this.operation ? `, Operation: ${this.operation}` : ''})`);
    }
}

/**
 * Represents an error that occurs during logger initialization.
 * @extends CustomError
 */
export class LoggerInitializationError extends CustomError {
    /**
     * Creates an instance of LoggerInitializationError.
     * @param {string} message - The error message.
     * @param {string} [component] - The optional component that failed during logger initialization.
     */
    constructor(message: string, public readonly component?: string) {
        super('LoggerInitializationError', message);
    }

    /**
     * Logs the logger initialization error details.
     * @param {any} logger - The logger object used for logging the error.
     */
    public log(logger: any): void {
        logger.error(`Logger Initialization Error: ${this.message}${this.component ? ` (Component: ${this.component})` : ''}`);
    }
}