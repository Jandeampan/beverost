import { ApiError, NetworkError, ParseError, ValidationError, AuthenticationError, AuthorizationError } from '../src';
describe('Custom Error Classes', () => {
    test('ApiError should have correct properties', () => {
        const status = 404;
        const message = 'Not Found';
        const error = new ApiError(status, message);
        expect(error).toBeInstanceOf(ApiError);
        expect(error.name).toBe('ApiError');
        expect(error.status).toBe(status);
        expect(error.message).toBe(message);
    });
    test('NetworkError should have correct properties', () => {
        const message = 'Network Error';
        const error = new NetworkError(message);
        expect(error).toBeInstanceOf(NetworkError);
        expect(error.name).toBe('NetworkError');
        expect(error.message).toBe(message);
    });
    test('ParseError should have correct properties', () => {
        const message = 'Parsing Error';
        const error = new ParseError(message);
        expect(error).toBeInstanceOf(ParseError);
        expect(error.name).toBe('ParseError');
        expect(error.message).toBe(message);
    });
    test('ValidationError should have correct properties', () => {
        const message = 'Validation Error';
        const error = new ValidationError(message);
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.name).toBe('ValidationError');
        expect(error.message).toBe(message);
    });
    test('AuthenticationError should have correct properties', () => {
        const message = 'Authentication Error';
        const error = new AuthenticationError(message);
        expect(error).toBeInstanceOf(AuthenticationError);
        expect(error.name).toBe('AuthenticationError');
        expect(error.message).toBe(message);
    });
    test('AuthorizationError should have correct properties', () => {
        const message = 'Authorization Error';
        const error = new AuthorizationError(message);
        expect(error).toBeInstanceOf(AuthorizationError);
        expect(error.name).toBe('AuthorizationError');
        expect(error.message).toBe(message);
    });
});
