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
} from '../src';

describe('Custom Error Classes', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('TestLogger');
    logger.setLogFormat('[{level}] - [{timestamp}] - [{context}] {message}');
    logger.setLogFileName('test-errors.log');
    logger.setLogLevel('debug');
  });

  const testErrorClass = (
    ErrorClass: new (...args: any[]) => Error,
    errorName: string,
    constructorArgs: any[],
    expectedProperties: { [key: string]: any },
    expectedLogMessage: string
  ) => {
    describe(`${errorName}`, () => {
      let error: Error;
      let logSpy: jest.SpyInstance;

      beforeEach(() => {
        error = new ErrorClass(...constructorArgs);
        (error as any).logger = logger;
        logSpy = jest.spyOn(logger, 'error');
      });

      afterEach(() => {
        logSpy.mockRestore();
      });

      it('should be an instance of the correct class', () => {
        expect(error).toBeInstanceOf(ErrorClass);
      });

      it('should have the correct name', () => {
        expect(error.name).toBe(errorName);
      });

      it('should have the correct properties', () => {
        for (const [key, value] of Object.entries(expectedProperties)) {
          expect((error as any)[key]).toEqual(value);
        }
      });

      it('should log the correct message', () => {
        (error as any).log();
        expect(logSpy).toHaveBeenCalledWith(expectedLogMessage);
      });
    });
  };

  testErrorClass(
    ApiError,
    'ApiError',
    [404, 'Not Found', 'REQ123'],
    { status: 404, message: 'Not Found', requestId: 'REQ123' },
    'API Error 404: Not Found (Request ID: REQ123)'
  );

  testErrorClass(
    NetworkError,
    'NetworkError',
    ['Network Error', 'ECONNREFUSED'],
    { message: 'Network Error', code: 'ECONNREFUSED' },
    'Network Error (ECONNREFUSED): Network Error'
  );

  testErrorClass(
    ParseError,
    'ParseError',
    ['Parsing Error', 'JSON'],
    { message: 'Parsing Error', source: 'JSON' },
    'Parse Error in JSON: Parsing Error'
  );

  testErrorClass(
    ValidationError,
    'ValidationError',
    ['Validation Error', ['username', 'email']],
    { message: 'Validation Error', fields: ['username', 'email'] },
    'Validation Error: Validation Error (Fields: username, email)'
  );

  testErrorClass(
    AuthenticationError,
    'AuthenticationError',
    ['Authentication Error', 'user123'],
    { message: 'Authentication Error', userId: 'user123' },
    'Authentication Error: Authentication Error (User ID: user123)'
  );

  testErrorClass(
    AuthorizationError,
    'AuthorizationError',
    ['Authorization Error', 'admin-panel', 'DELETE'],
    { message: 'Authorization Error', resource: 'admin-panel', action: 'DELETE' },
    'Authorization Error: Authorization Error (Resource: admin-panel) (Action: DELETE)'
  );

  testErrorClass(
    RateLimitError,
    'RateLimitError',
    ['Rate Limit Exceeded', 60],
    { message: 'Rate Limit Exceeded', retryAfter: 60 },
    'Rate Limit Error: Rate Limit Exceeded (Retry After: 60s)'
  );

  testErrorClass(
    DatabaseError,
    'DatabaseError',
    ['Database Error', 'INSERT'],
    { message: 'Database Error', operation: 'INSERT' },
    'Database Error: Database Error (Operation: INSERT)'
  );

  testErrorClass(
    ConfigurationError,
    'ConfigurationError',
    ['Configuration Error', 'API_KEY'],
    { message: 'Configuration Error', configKey: 'API_KEY' },
    'Configuration Error: Configuration Error (Config Key: API_KEY)'
  );

  testErrorClass(
    ExternalServiceError,
    'ExternalServiceError',
    ['External Service Error', 'TestService'],
    { message: 'External Service Error', serviceName: 'TestService' },
    'External Service Error (TestService): External Service Error'
  );

  afterAll(() => {
    logger.verbose('All tests completed', { service: 'user-service' });
  });
});