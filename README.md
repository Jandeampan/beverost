# Extra Errors

**Extra Errors** is a TypeScript library that provides custom error classes for handling different types of errors in your applications.

## Installation

To install the library, you can use npm or yarn:

```bash
npm install extra-errors
```

or

```bash
yarn add extra-errors
```

## Usage

Import the error classes you need and use them in your application:

```typescript
import { ApiError, NetworkError, ParseError, ValidationError, AuthenticationError, AuthorizationError } from 'extra-errors';

// Example usage of ApiError
function fetchData() {
    throw new ApiError(404, 'Resource not found');
}

// Example usage of NetworkError
function makeNetworkRequest() {
    throw new NetworkError('Network request failed');
}

// Example usage of ParseError
function parseData() {
    throw new ParseError('Failed to parse data');
}

// Example usage of ValidationError
function validateInput() {
    throw new ValidationError('Invalid input format');
}

// Example usage of AuthenticationError
function authenticate() {
    throw new AuthenticationError('Invalid credentials');
}

// Example usage of AuthorizationError
function checkPermissions() {
    throw new AuthorizationError('Insufficient permissions to access resource');
}
```

## Error Types

### ApiError

Custom error class for API-related errors.

#### ApiError Constructor

- `status` (number): The HTTP status code of the error.
- `message` (string): The error message.

### NetworkError

Custom error class for network-related errors.

#### NetworkError Constructor

- `message` (string): The error message.

### ParseError

Custom error class for parsing-related errors.

#### ParseError Constructor

- `message` (string): The error message.

### ValidationError

Custom error class for validation-related errors.

#### ValidationError Constructor

- `message` (string): The error message.

### AuthenticationError

Custom error class for authentication-related errors.

#### AuthenticationError Constructor

- `message` (string): The error message.

### AuthorizationError

Custom error class for authorization-related errors.

#### AuthorizationError Constructor

- `message` (string): The error message.

## Contributing

We welcome contributions to improve this library. Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

- Author: Jandeampan
- GitHub: [Jandeampan/extra-errors](https://github.com/Jandeampan/extra-errors)
