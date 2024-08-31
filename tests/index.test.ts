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
    ExternalServiceError,
    Logger
} from '../src/index';

describe('Index exports', () => {
    it('should export all error classes', () => {
        expect(ApiError).toBeInstanceOf(Function);
        expect(NetworkError).toBeInstanceOf(Function);
        expect(ParseError).toBeInstanceOf(Function);
        expect(ValidationError).toBeInstanceOf(Function);
        expect(AuthenticationError).toBeInstanceOf(Function);
        expect(AuthorizationError).toBeInstanceOf(Function);
        expect(RateLimitError).toBeInstanceOf(Function);
        expect(DatabaseError).toBeInstanceOf(Function);
        expect(ConfigurationError).toBeInstanceOf(Function);
        expect(ExternalServiceError).toBeInstanceOf(Function);
    });

    it('should export Logger class', () => {
        expect(Logger).toBeInstanceOf(Function);
    });

    it('should create instances of error classes', () => {
        expect(new ApiError(400, 'Bad Request')).toBeInstanceOf(ApiError);
        expect(new NetworkError('Connection timeout')).toBeInstanceOf(NetworkError);
        expect(new ParseError('Invalid JSON')).toBeInstanceOf(ParseError);
        expect(new ValidationError('Invalid input')).toBeInstanceOf(ValidationError);
        expect(new AuthenticationError('Invalid credentials')).toBeInstanceOf(AuthenticationError);
        expect(new AuthorizationError('Insufficient permissions')).toBeInstanceOf(AuthorizationError);
        expect(new RateLimitError('Too many requests')).toBeInstanceOf(RateLimitError);
        expect(new DatabaseError('Connection failed')).toBeInstanceOf(DatabaseError);
        expect(new ConfigurationError('Missing configuration')).toBeInstanceOf(ConfigurationError);
        expect(new ExternalServiceError('Service unavailable', 'ExternalAPI')).toBeInstanceOf(ExternalServiceError);
    });

    it('should create an instance of Logger', () => {
        const logger = new Logger('TestContext', 'logs/test.log');
        expect(logger).toBeInstanceOf(Logger);
    });

    it('should log messages using Logger', () => {
        const logger = new Logger('TestContext', 'logs/test.log');
        logger.setLogFilePath('logs/test.log', { recursive: true });
        expect(() => logger.info('Test info message')).not.toThrow();
        expect(() => logger.warn('Test warning message')).not.toThrow();
        expect(() => logger.error('Test error message')).not.toThrow();
        expect(() => logger.debug('Test debug message')).not.toThrow();
    });
});