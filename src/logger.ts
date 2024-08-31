import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs';
import {
    LoggerInitializationError,
    FileNotFoundError,
    LogDirectoryNotFoundError,
    LogFileOperationError
} from './errors';

/**
 * A robust logging utility that leverages Winston for flexible logging configuration.
 * 
 * The `Logger` class facilitates logging across different levels with customizable formats and destinations.
 * It ensures that log files are created in the specified directory and provides options for logging to both files and the console.
 * 
 * @class Logger
 */
export class Logger {
    private logger: any;
    private logFilePath: string;
    private logFormat: string = '[{level}] - [{timestamp}]{context} {message}';
    private logFileName: string = 'combined.log';

    /**
     * Creates a new instance of `Logger`.
     * 
     * Initializes the logger with the specified file path. If the log file directory does not exist, it will be created.
     * 
     * @constructor
     * @param {string} [context] - An optional context or module name for this logger instance, useful for distinguishing logs from different sources.
     * @param {string} [logFilePath='logs/combined.log'] - The path where log files will be saved, including the file name. Defaults to 'logs/combined.log'.
     * @throws {LogDirectoryNotFoundError} Throws an error if the log file directory does not exist and the `recursive` option is not set to true.
     */
    constructor(private context?: string, logFilePath: string = 'logs/combined.log') {
        this.logFilePath = logFilePath;
        try {
            this.setLogFilePath(this.logFilePath);
        } catch (error) {
            throw new LoggerInitializationError('Failed to initialize logger:', error instanceof Error ? error.message : String(error));
        }
    }

    /**
    * Configures the path for the log file and ensures that the directory exists.
    * 
    * Creates the directory if it does not exist based on the provided options.
    * Throws an error if the directory does not exist or if the file does not exist when `recursive` is false or not specified.
    * 
    * @param {string} filePath - The full path to the log file, including the file name.
    * @param {Object} [options] - Configuration options for directory creation.
    * @param {boolean} [options.recursive=false] - Whether to create the directory and any parent directories if they do not exist. Defaults to false.
    * @returns {void}
    * @throws {LogDirectoryNotFoundError} Throws an error if the directory does not exist and `options.recursive` is false or not provided.
    * @throws {FileNotFoundError} Throws an error if the directory exists but the log file does not exist and `options.recursive` is false or not provided.
    * 
    * @example
    * // Configure log file path and create directory if needed
    * logger.setLogFilePath('/var/logs/myapp/application.log', { recursive: true });
    */
    public setLogFilePath(filePath: string, options?: { 
        recursive?: boolean 
    }): void {
        this.logFilePath = filePath;
        const dir = path.dirname(this.logFilePath);

    // Check if directory exists
    if (!fs.existsSync(dir)) {
        if (options?.recursive) {
            fs.mkdirSync(dir, { recursive: true });
        } else {
            throw new LogDirectoryNotFoundError('Log directory does not exist', dir);
        }
    }

    // Check if the log file exists in the existing directory
    if (!fs.existsSync(this.logFilePath) && !fs.existsSync(dir)) {
        if (!options?.recursive) {
            throw new FileNotFoundError('Log file does not exist', this.logFilePath);
        }
    }
        this.initLogger();
    }

    /**
     * Updates the log file name and adjusts the path accordingly.
     * 
     * @param {string} fileName - The new name for the log file.
     * @returns {void}
     * @throws {LogFileOperationError} Throws an error if the file name is invalid or cannot be updated.
     * 
     * @example
     * // Update log file name to 'app.log'
     * logger.setLogFileName('app.log');
     */
    public setLogFileName(fileName: string): void {
        try {
            this.logFileName = fileName;
            this.logFilePath = path.join(path.dirname(this.logFilePath), this.logFileName);
            this.initLogger();
        } catch (error) {
            throw new LogFileOperationError('Failed to update log file name', fileName);
        }
    }

    /**
     * Customizes the log message format.
     * 
     * The format string can include placeholders such as {level}, {timestamp}, {context}, and {message}.
     * 
     * @param {string} format - The new format string for log messages.
     * @returns {void}
     * 
     * @example
     * // Set log format to include only level and message
     * logger.setLogFormat('[{level}] {message}');
     */
    public setLogFormat(format: string): void {
        this.logFormat = format;
        this.initLogger();
    }

    /**
     * Initializes or reinitializes the logger with the current configuration.
     * 
     * This method sets up the format, levels, and transports based on the current configuration.
     * 
     * @private
     * @returns {void}
     */
    private initLogger(): void {
        const customFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
            let msg = this.logFormat
                .replace('{level}', level ? level.toUpperCase() : '')
                .replace('{timestamp}', timestamp || '')
                .replace('{context}', this.context ? ` - [${this.context}]` : '')
                .replace('{message}', message);

            if (Object.keys(metadata).length > 0) {
                msg += ` ${JSON.stringify(metadata)}`;
            }

            return msg;
        });

        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.errors({ stack: true }),
                format.splat(),
                customFormat
            ),
            defaultMeta: { service: 'user-service' },
            transports: [
                new transports.File({ filename: path.join(path.dirname(this.logFilePath), 'error.log'), level: 'error' }),
                new transports.File({ filename: this.logFilePath })
            ]
        });

        if (process.env['NODE_ENV'] !== 'production') {
            this.logger.add(new transports.Console({
                format: format.combine(
                    format.colorize(),
                    customFormat
                )
            }));
        }
    }

    /**
     * Logs an informational message.
     * 
     * @param {string} message - The message to log.
     * @param {Object} [meta] - Optional metadata to include in the log.
     * @returns {void}
     * 
     * @example
     * // Log an informational message with additional metadata
     * logger.info('Server started successfully', { port: 3000 });
     */
    public info(message: string, meta?: Object): void {
        this.logWithLevel('info', message, meta);
    }

    /**
     * Logs a warning message.
     * 
     * @param {string} message - The message to log.
     * @param {Object} [meta] - Optional metadata to include in the log.
     * @returns {void}
     * 
     * @example
     * // Log a warning message about high memory usage
     * logger.warn('Memory usage is high', { usage: '85%' });
     */
    public warn(message: string, meta?: Object): void {
        this.logWithLevel('warn', message, meta);
    }

    /**
     * Logs an error message.
     * 
     * @param {string} message - The message to log.
     * @param {Object} [meta] - Optional metadata to include in the log.
     * @returns {void}
     * 
     * @example
     * // Log an error message with details about the failure
     * logger.error('Database connection failed', { error: 'Connection timeout' });
     */
    public error(message: string, meta?: Object): void {
        this.logWithLevel('error', message, meta);
    }

    /**
     * Logs a debug message.
     * 
     * @param {string} message - The message to log.
     * @param {Object} [meta] - Optional metadata to include in the log.
     * @returns {void}
     * 
     * @example
     * // Log a debug message with user ID
     * logger.debug('User authentication debug', { userId: 123 });
     */
    public debug(message: string, meta?: Object): void {
        this.logWithLevel('debug', message, meta);
    }

    /**
     * Logs a verbose message.
     * 
     * @param {string} message - The message to log.
     * @param {Object} [meta] - Optional metadata to include in the log.
     * @returns {void}
     * 
     * @example
     * // Log a verbose message with request ID
     * logger.verbose('Request processing details', { requestId: 'abc123' });
     */
    public verbose(message: string, meta?: Object): void {
        this.logWithLevel('verbose', message, meta);
    }

    /**
     * Internal method to handle logging with a specified level.
     * 
     * @private
     * @param {string} level - The log level (e.g., 'info', 'warn', 'error').
     * @param {string} message - The message to log.
     * @param {Object} [meta] - Optional metadata to include in the log.
     * @returns {void}
     */
    private logWithLevel(level: string, message: string, meta?: Object): void {
        this.logger.log({
            level,
            message,
            ...meta
        });
    }

    /**
     * Logs a message without including timestamp and log level.
     * 
     * @param {string} message - The message to log.
     * @param {Object} [meta] - Optional metadata to include in the log.
     * @returns {void}
     * 
     * @example
     * // Log a message without timestamp and level
     * logger.logWithoutDetails('System rebooted');
     */
    public logWithoutDetails(message: string, meta?: Object): void {
        this.logger.log({
            level: 'info',
            message,
            ...meta,
            timestamp: false
        });
    }

    /**
     * Logs a message with customizable options.
     * 
     * @param {string} message - The message to log.
     * @param {Object} [options] - Optional logging options.
     * @param {string} [options.level] - The log level (default: undefined, which means no default level).
     * @param {boolean} [options.timestamp] - Whether to include a timestamp (default: undefined, which means no default timestamp).
     * @param {Object} [options.meta] - Additional metadata to include in the log.
     * @returns {void}
     * 
     * @example
     * // Log a message with custom options
     * logger.log('User logged in', { level: 'debug', timestamp: false, meta: { userId: 123 } });
     */
    public log(message: string, options?: { level?: string; timestamp?: boolean; meta?: Object }): void {
        const { level, timestamp, meta = {} } = options || {};
        this.logger.log({
            level,
            message,
            ...meta,
            timestamp: timestamp === undefined ? undefined : (timestamp ? undefined : false)
        });
    }

    /**
     * Sets the log level for the logger.
     * 
     * Adjusts the logger’s output to include only messages of the specified level or higher.
     * 
     * @param {string} level - The log level to set (e.g., 'info', 'debug', 'error'). The level determines the verbosity of the logs.
     * @returns {void}
     * 
     * @example
     * // Set the log level to 'debug' to capture debug messages and higher
     * logger.setLogLevel('debug');
     */
    public setLogLevel(level: string): void {
        this.logger.level = level;
    }

    /**
     * Adds a new transport to the logger.
     * 
     * Transports are used to define where and how log messages are recorded (e.g., console, files, external services).
     * 
     * @param {any} transport - The transport instance to add. Example: `new transports.Console()`.
     * @returns {void}
     * 
     * @example
     * // Add a new console transport to log messages to the console
     * logger.addTransport(new transports.Console());
     */
    public addTransport(transport: any): void {
        this.logger.add(transport);
    }

    /**
     * Removes a transport from the logger.
     * 
     * Stops sending log messages to the specified transport.
     * 
     * @param {any} transport - The transport instance to remove.
     * @returns {void}
     * 
     * @example
     * // Remove the console transport
     * logger.removeTransport(new transports.Console());
     */
    public removeTransport(transport: any): void {
        this.logger.remove(transport);
    }
}
