import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Logger class for handling application-wide logging.
 * This class uses Winston for logging and provides a consistent interface for logging across the application.
 * 
 * @class Logger
 */
export class Logger {
    private logger: any;
    private logFilePath: string;
    private logFormat: string = '[{level}] - [{timestamp}]{context} {message}';
    private logFileName: string = 'combined.log';

    /**
     * Creates a new instance of Logger.
     * If the provided log file path does not exist, it will be created.
     * 
     * @constructor
     * @param {string} [context] - The context or module name for this logger instance. (optional)
     * @param {string} [logFilePath] - The path to the log file directory. If not provided, defaults to 'logs/combined.log'.
     */
    constructor(private context?: string, logFilePath: string = 'logs/combined.log') {
        this.logFilePath = logFilePath;
        this.setLogFilePath(this.logFilePath);
    }

    /**
     * Sets the log file path and ensures the directory exists.
     * 
     * @param {string} filePath - The path to the log file.
     * @param {boolean} [recursive] - Whether to create the directory recursively if it doesn't exist. (optional)
     * @returns {void}
     * @throws {Error} If the directory doesn't exist and recursive is false.
     */
    public setLogFilePath(filePath: string, recursive?: boolean): void {
        this.logFilePath = filePath;
        const dir = path.dirname(this.logFilePath);
        
        if (!fs.existsSync(dir)) {
            if (recursive) {
                fs.mkdirSync(dir, { recursive: true });
            } else {
                throw new Error(`Log directory does not exist: ${dir}`);
            }
        }
        
        this.initLogger();
    }

    /**
     * Sets the log file name and updates the file path accordingly.
     * 
     * @param {string} fileName - The name of the log file.
     * @returns {void}
     */
    public setLogFileName(fileName: string): void {
        this.logFileName = fileName;
        this.logFilePath = path.join(path.dirname(this.logFilePath), this.logFileName);
        this.initLogger();
    }

    /**
     * Sets the log message format.
     * 
     * @param {string} format - The format string for log messages.
     * Available placeholders: {level}, {timestamp}, {context}, {message}
     * @returns {void}
     */
    public setLogFormat(format: string): void {
        this.logFormat = format;
        this.initLogger();
    }

    /**
     * Initializes the logger with the current configuration.
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
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
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
     * Logs an info message.
     * 
     * @param {string} message - The message to log.
     * @param {Object} [meta] - Optional metadata to include in the log.
     * @returns {void}
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
     */
    public verbose(message: string, meta?: Object): void {
        this.logWithLevel('verbose', message, meta);
    }

    /**
     * Internal method to handle logging with a specific level.
     * 
     * @private
     * @param {string} level - The log level.
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
     * Logs a message without timestamp and log level.
     * 
     * @param {string} message - The message to log.
     * @param {Object} [meta] - Optional metadata to include in the log.
     * @returns {void}
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
     * @param {string} [options.level] - The log level (default: 'info').
     * @param {boolean} [options.timestamp] - Whether to include a timestamp (default: true).
     * @param {Object} [options.meta] - Additional metadata to include in the log.
     * @returns {void}
     */
    public log(message: string, options?: { level?: string; timestamp?: boolean; meta?: Object }): void {
        if (!options) {
            this.logger.log(message);
        } else {
            const { level = 'info', timestamp = true, meta = {} } = options;
            this.logger.log({
                level,
                message,
                ...meta,
                timestamp: timestamp ? undefined : false
            });
        }
    }

    /**
     * Sets the log level for the logger.
     * 
     * @param {string} level - The log level to set (e.g., 'info', 'debug', 'error').
     * @returns {void}
     */
    public setLogLevel(level: string): void {
        this.logger.level = level;
    }

    /**
     * Adds a new transport to the logger.
     * 
     * @param {any} transport - The transport to add.
     * @returns {void}
     */
    public addTransport(transport: any): void {
        this.logger.add(transport);
    }

    /**
     * Removes a transport from the logger.
     * 
     * @param {any} transport - The transport to remove.
     * @returns {void}
     */
    public removeTransport(transport: any): void {
        this.logger.remove(transport);
    }
}