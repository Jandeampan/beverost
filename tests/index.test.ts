import { expect } from '@jest/globals';
import * as path from 'path';
import * as fs from 'fs';
import {
  Logger,
  CustomError,
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
  FileNotFoundError
} from '../src/index';
import { transports } from 'winston';

describe('Logger', () => {
  let logger: Logger;
  const testLogDir = path.join(__dirname, 'test_logs');
  const testLogFile = path.join(testLogDir, 'test.log');

  beforeEach(async () => {
    logger = new Logger('TestContext', testLogFile, { recursive: true });
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for file creation
  });

  afterEach(async () => {
    if (fs.existsSync(testLogFile)) {
      fs.unlinkSync(testLogFile);
    }
    if (fs.existsSync(testLogDir)) {
      await fs.promises.rm(testLogDir, { recursive: true, force: true });
    }
  });

  it('should create a log file with recursive option', async () => {
    await logger.info('Test log message');
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for file write
    expect(fs.existsSync(testLogFile)).toBe(true);
  });

  it('should set log file path with recursive option', async () => {
    const newLogFile = path.join(testLogDir, 'subdir', 'new.log');
    await logger.setLogFilePath(newLogFile, { recursive: true });
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for directory creation
    expect(fs.existsSync(path.dirname(newLogFile))).toBe(true);
  });

  it('should log messages with different levels', async () => {
    await logger.info('Info message');
    await logger.warn('Warning message');
    await logger.error('Error message');
    await logger.debug('Debug message');
    await logger.verbose('Verbose message');
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for file write

    const logContent = fs.readFileSync(testLogFile, 'utf8');
    expect(logContent).toContain('INFO');
    expect(logContent).toContain('WARN');
    expect(logContent).toContain('ERROR');
    expect(logContent).toContain('DEBUG');
    expect(logContent).toContain('VERBOSE');
  });

  it('should include context in log messages', async () => {
    await logger.info('Context test');
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for file write
    const logContent = fs.readFileSync(testLogFile, 'utf8');
    expect(logContent).toContain('[TestContext]');
  });

  it('should handle log without details', async () => {
    await logger.logWithoutDetails('No details log');
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for file write
    const logContent = fs.readFileSync(testLogFile, 'utf8');
    expect(logContent).toContain('No details log');
    expect(logContent).not.toContain('timestamp');
  });

  it('should allow setting log level', async () => {
    logger.setLogLevel('error');
    await logger.info('This should not be logged');
    await logger.error('This should be logged');
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for file write
    const logContent = fs.readFileSync(testLogFile, 'utf8');
    expect(logContent).not.toContain('This should not be logged');
    expect(logContent).toContain('This should be logged');
  });

  it('should add and remove transports', () => {
    const consoleTransport = new transports.Console();
    logger.addTransport(consoleTransport);
    expect(logger['logger'].transports).toContain(consoleTransport);
    logger.removeTransport(consoleTransport);
    expect(logger['logger'].transports).not.toContain(consoleTransport);
  });
});

describe('CustomError', () => {
  const mockLogger = { error: jest.fn() };

  it('should create and log CustomError correctly', () => {
    const customError = new (class extends CustomError {
      log(logger: any): void {
        logger.error(`Custom Error: ${this.name} - ${this.message}`);
      }
    })('CustomErrorName', 'This is a custom error message');

    customError.log(mockLogger);

    expect(mockLogger.error).toHaveBeenCalledWith('Custom Error: CustomErrorName - This is a custom error message');
  });

  it('should create and log ApiError correctly', () => {
    const error = new ApiError(404, 'Not Found', 'REQ123');
    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('Not Found');
    expect(error.status).toBe(404);
    expect(error.requestId).toBe('REQ123');
    error.log(mockLogger);
    expect(mockLogger.error).toHaveBeenCalledWith('API Error 404: Not Found (Request ID: REQ123)');
  });

  it('should create and log NetworkError correctly', () => {
    const error = new NetworkError('Connection failed', 'TIMEOUT');
    expect(error.name).toBe('NetworkError');
    expect(error.message).toBe('Connection failed');
    expect(error.code).toBe('TIMEOUT');
    error.log(mockLogger);
    expect(mockLogger.error).toHaveBeenCalledWith('Network Error (TIMEOUT): Connection failed');
  });

  it('should create and log ParseError correctly', () => {
    const error = new ParseError('Invalid JSON');
    expect(error.name).toBe('ParseError');
    expect(error.message).toBe('Invalid JSON');
    error.log(mockLogger);
    expect(mockLogger.error).toHaveBeenCalledWith('Parse Error: Invalid JSON');
  });

  it('should create and log ValidationError correctly', () => {
    const error = new ValidationError('Invalid input');
    expect(error.name).toBe('ValidationError');
    expect(error.message).toBe('Invalid input');
    error.log(mockLogger);
    expect(mockLogger.error).toHaveBeenCalledWith('Validation Error: Invalid input');
  });

  it('should create and log AuthenticationError correctly', () => {
    const error = new AuthenticationError('Invalid credentials');
    expect(error.name).toBe('AuthenticationError');
    expect(error.message).toBe('Invalid credentials');
    error.log(mockLogger);
    expect(mockLogger.error).toHaveBeenCalledWith('Authentication Error: Invalid credentials');
  });

  it('should create and log AuthorizationError correctly', () => {
    const error = new AuthorizationError('Insufficient permissions');
    expect(error.name).toBe('AuthorizationError');
    expect(error.message).toBe('Insufficient permissions');
    error.log(mockLogger);
    expect(mockLogger.error).toHaveBeenCalledWith('Authorization Error: Insufficient permissions');
  });

  it('should create and log RateLimitError correctly', () => {
    const error = new RateLimitError('Too many requests');
    expect(error.name).toBe('RateLimitError');
    expect(error.message).toBe('Too many requests');
    error.log(mockLogger);
    expect(mockLogger.error).toHaveBeenCalledWith('Rate Limit Error: Too many requests');
  });

  it('should create and log DatabaseError correctly', () => {
    const error = new DatabaseError('Query failed', 'INSERT');
    expect(error.name).toBe('DatabaseError');
    expect(error.message).toBe('Query failed');
    expect(error.operation).toBe('INSERT');
    error.log(mockLogger);
    expect(mockLogger.error).toHaveBeenCalledWith('Database Error: Query failed (Operation: INSERT)');
  });

  it('should create and log ConfigurationError correctly', () => {
    const error = new ConfigurationError('Invalid configuration');
    expect(error.name).toBe('ConfigurationError');
    expect(error.message).toBe('Invalid configuration');
    error.log(mockLogger);
    expect(mockLogger.error).toHaveBeenCalledWith('Configuration Error: Invalid configuration');
  });

  it('should create and log ExternalServiceError correctly', () => {
    const error = new ExternalServiceError('External service unavailable', 'testService');
    expect(error.name).toBe('ExternalServiceError');
    expect(error.message).toBe('External service unavailable');
    expect(error.serviceName).toBe('testService');
    error.log(mockLogger);
    expect(mockLogger.error).toHaveBeenCalledWith('External Service Error: External service unavailable (Service: testService)');
  });

  it('should create and log FileNotFoundError correctly', () => {
    const error = new FileNotFoundError('config.json');
    expect(error.name).toBe('FileNotFoundError');
    expect(error.message).toBe('File not found: config.json');
    error.log(mockLogger);
    expect(mockLogger.error).toHaveBeenCalledWith('File Not Found Error: File not found: config.json');
  });

  it('should log errors after throwing', () => {
    try {
      throw new DatabaseError('Query failed', 'INSERT');
    } catch (error) {
      if (error instanceof DatabaseError) {
        error.log(mockLogger);
        expect(mockLogger.error).toHaveBeenCalledWith('Database Error: Query failed (Operation: INSERT)');
      }
    }
  });
});