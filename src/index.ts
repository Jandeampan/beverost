// src/index.ts

/**
 * Represents an error that occurs during API communication.
 * This class extends the built-in Error class to provide more specific error handling for API-related issues.
 * 
 * ApiError is particularly useful when dealing with HTTP requests and responses. It allows you to encapsulate
 * both the HTTP status code and a descriptive message, providing more context about what went wrong during
 * an API interaction.
 * 
 * @extends Error
 */
export class ApiError extends Error {
    /**
     * Creates a new instance of ApiError.
     * 
     * @param {number} status - The HTTP status code associated with the error.
     *                          This can be used to determine the specific type of API error.
     *                          Common status codes include:
     *                          - 400: Bad Request
     *                          - 401: Unauthorized
     *                          - 403: Forbidden
     *                          - 404: Not Found
     *                          - 500: Internal Server Error
     * @param {string} message - A descriptive error message providing more details about the API error.
     * 
     * @example
     * // Creating a new ApiError for a resource not found
     * const apiError = new ApiError(404, "User with ID 12345 not found");
     * console.log(apiError.status); // Outputs: 404
     * console.log(apiError.message); // Outputs: "User with ID 12345 not found"
     * console.log(apiError.name); // Outputs: "ApiError"
     * 
     * @example
     * // Using ApiError in a try-catch block
     * async function fetchUser(id) {
     *   try {
     *     const response = await fetch(`/api/users/${id}`);
     *     if (!response.ok) {
     *       throw new ApiError(response.status, `Failed to fetch user: ${response.statusText}`);
     *     }
     *     return await response.json();
     *   } catch (error) {
     *     if (error instanceof ApiError) {
     *       console.error(`API Error ${error.status}: ${error.message}`);
     *     } else {
     *       console.error('An unexpected error occurred', error);
     *     }
     *   }
     * }
     */
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Represents an error that occurs due to network-related issues.
 * This class is useful for handling errors such as connection timeouts, DNS failures, offline status, etc.
 * 
 * NetworkError provides a way to distinguish network-related issues from other types of errors,
 * allowing for more specific error handling and user feedback in network-dependent applications.
 * 
 * @extends Error
 */
export class NetworkError extends Error {
    /**
     * Creates a new instance of NetworkError.
     * 
     * @param {string} message - A descriptive error message providing details about the network issue.
     * 
     * @example
     * // Creating a new NetworkError for a timeout scenario
     * const networkError = new NetworkError("Connection timed out after 30 seconds");
     * console.log(networkError.message); // Outputs: "Connection timed out after 30 seconds"
     * console.log(networkError.name); // Outputs: "NetworkError"
     * 
     * @example
     * // Using NetworkError in a fetch request
     * async function fetchData(url) {
     *   try {
     *     const controller = new AbortController();
     *     const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
     *     
     *     const response = await fetch(url, { signal: controller.signal });
     *     clearTimeout(timeoutId);
     *     
     *     return await response.json();
     *   } catch (error) {
     *     if (error.name === 'AbortError') {
     *       throw new NetworkError('Request timed out');
     *     }
     *     throw error;
     *   }
     * }
     */
    constructor(message: string) {
        super(message);
        this.name = 'NetworkError';
    }
}

/**
 * Represents an error that occurs during parsing operations.
 * This class is particularly useful when dealing with operations like JSON parsing, XML parsing,
 * or any other data format parsing where the input might be malformed or unexpected.
 * 
 * ParseError allows you to provide more context about what went wrong during the parsing process,
 * which can be invaluable for debugging and providing meaningful error messages to users or developers.
 * 
 * @extends Error
 */
export class ParseError extends Error {
    /**
     * Creates a new instance of ParseError.
     * 
     * @param {string} message - A descriptive error message providing details about the parsing issue.
     * 
     * @example
     * // Creating a new ParseError for invalid JSON
     * const parseError = new ParseError("Invalid JSON: Unexpected token at position 4");
     * console.log(parseError.message); // Outputs: "Invalid JSON: Unexpected token at position 4"
     * console.log(parseError.name); // Outputs: "ParseError"
     * 
     * @example
     * // Using ParseError in a JSON parsing function
     * function parseJSON(jsonString) {
     *   try {
     *     return JSON.parse(jsonString);
     *   } catch (error) {
     *     throw new ParseError(`Failed to parse JSON: ${error.message}`);
     *   }
     * }
     * 
     * try {
     *   const data = parseJSON('{"name": "John", "age": }');
     * } catch (error) {
     *   if (error instanceof ParseError) {
     *     console.error('Parsing failed:', error.message);
     *   }
     * }
     */
    constructor(message: string) {
        super(message);
        this.name = 'ParseError';
    }
}

/**
 * Represents an error that occurs due to validation failures.
 * This class is useful for handling errors related to input validation, data integrity checks,
 * form submissions, or any scenario where data needs to conform to specific rules or formats.
 * 
 * ValidationError provides a standardized way to handle and communicate validation issues,
 * which is crucial for maintaining data integrity and providing clear feedback in user interfaces.
 * 
 * @extends Error
 */
export class ValidationError extends Error {
    /**
     * Creates a new instance of ValidationError.
     * 
     * @param {string} message - A descriptive error message providing details about the validation issue.
     * 
     * @example
     * // Creating a new ValidationError for an invalid email format
     * const validationError = new ValidationError("Invalid email format: missing @ symbol");
     * console.log(validationError.message); // Outputs: "Invalid email format: missing @ symbol"
     * console.log(validationError.name); // Outputs: "ValidationError"
     * 
     * @example
     * // Using ValidationError in a form validation function
     * function validateUserInput(username, email, password) {
     *   if (username.length < 3) {
     *     throw new ValidationError("Username must be at least 3 characters long");
     *   }
     *   if (!email.includes('@')) {
     *     throw new ValidationError("Invalid email format");
     *   }
     *   if (password.length < 8) {
     *     throw new ValidationError("Password must be at least 8 characters long");
     *   }
     * }
     * 
     * try {
     *   validateUserInput('Jo', 'johndoe@example.com', 'pass123');
     * } catch (error) {
     *   if (error instanceof ValidationError) {
     *     console.error('Validation failed:', error.message);
     *   }
     * }
     */
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Represents an error that occurs due to authentication failures.
 * This class is useful for handling errors related to user authentication, token expiration,
 * invalid credentials, or any scenario where a user's identity needs to be verified.
 * 
 * AuthenticationError provides a clear way to distinguish authentication-related issues from
 * other types of errors, allowing for more specific error handling and appropriate user feedback
 * in applications that require user authentication.
 * 
 * @extends Error
 */
export class AuthenticationError extends Error {
    /**
     * Creates a new instance of AuthenticationError.
     * 
     * @param {string} message - A descriptive error message providing details about the authentication issue.
     * 
     * @example
     * // Creating a new AuthenticationError for invalid credentials
     * const authError = new AuthenticationError("Invalid username or password");
     * console.log(authError.message); // Outputs: "Invalid username or password"
     * console.log(authError.name); // Outputs: "AuthenticationError"
     * 
     * @example
     * // Using AuthenticationError in a login function
     * async function login(username, password) {
     *   try {
     *     const response = await fetch('/api/login', {
     *       method: 'POST',
     *       body: JSON.stringify({ username, password }),
     *       headers: { 'Content-Type': 'application/json' }
     *     });
     *     
     *     if (!response.ok) {
     *       if (response.status === 401) {
     *         throw new AuthenticationError('Invalid credentials');
     *       }
     *       throw new Error('Login failed');
     *     }
     *     
     *     return await response.json();
     *   } catch (error) {
     *     if (error instanceof AuthenticationError) {
     *       console.error('Authentication failed:', error.message);
     *       // Handle authentication failure (e.g., show error message to user)
     *     } else {
     *       console.error('An unexpected error occurred during login:', error);
     *     }
     *   }
     * }
     */
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

/**
 * Represents an error that occurs due to authorization failures.
 * This class is useful for handling errors related to user permissions, access control,
 * insufficient privileges, or any scenario where a user's right to perform an action needs to be verified.
 * 
 * AuthorizationError allows you to clearly distinguish permission-related issues from other types of errors,
 * enabling more precise error handling and appropriate feedback in applications with complex access control requirements.
 * 
 * @extends Error
 */
export class AuthorizationError extends Error {
    /**
     * Creates a new instance of AuthorizationError.
     * 
     * @param {string} message - A descriptive error message providing details about the authorization issue.
     * 
     * @example
     * // Creating a new AuthorizationError for insufficient permissions
     * const authzError = new AuthorizationError("Insufficient permissions to delete this resource");
     * console.log(authzError.message); // Outputs: "Insufficient permissions to delete this resource"
     * console.log(authzError.name); // Outputs: "AuthorizationError"
     * 
     * @example
     * // Using AuthorizationError in a function that checks user permissions
     * async function deleteResource(resourceId, user) {
     *   try {
     *     const userPermissions = await fetchUserPermissions(user);
     *     
     *     if (!userPermissions.includes('delete_resource')) {
     *       throw new AuthorizationError('User does not have permission to delete resources');
     *     }
     *     
     *     // Proceed with resource deletion
     *     await deleteResourceFromDatabase(resourceId);
     *     
     *   } catch (error) {
     *     if (error instanceof AuthorizationError) {
     *       console.error('Authorization failed:', error.message);
     *       // Handle authorization failure (e.g., show error message to user, log the attempt)
     *     } else {
     *       console.error('An unexpected error occurred while deleting the resource:', error);
     *     }
     *   }
     * }
     */
    constructor(message: string) {
        super(message);
        this.name = 'AuthorizationError';
    }
}
