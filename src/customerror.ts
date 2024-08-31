/**
 * CustomError is an abstract base class for creating custom error types.
 * It extends the built-in Error class and provides additional functionality.
 * 
 * @abstract
 * @class
 * @extends {Error}
 * 
 * @description
 * This class serves as a foundation for creating specialized error classes
 * in the application. It ensures that custom errors are properly initialized
 * and can be extended with additional logging capabilities.
 * 
 * @example
 * class NetworkError extends CustomError {
 *   constructor(message: string) {
 *     super('NetworkError', message);
 *   }
 * 
 *   log(logger: Logger) {
 *     logger.error(`[NetworkError]: ${this.message}`);
 *   }
 * }
 */
export abstract class CustomError extends Error {
    /**
     * Creates an instance of CustomError.
     * 
     * @param {string} name - The name of the error. This should typically be the class name.
     * @param {string} message - A descriptive message for the error.
     * 
     * @constructor
     * 
     * @description
     * The constructor initializes the error with a name and message. It also ensures
     * that the prototype chain is correctly set up for proper instanceof checks.
     */
    constructor(name: string, message: string) {
        super(message);
        this.name = name;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * Abstract method for logging the error.
     * 
     * @abstract
     * @param {any} logger - The logger object to use for logging the error.
     * @returns {void}
     * 
     * @description
     * This method should be implemented by subclasses to define how the error
     * should be logged. The implementation can vary based on the specific error
     * type and the logging system being used.
     */
    abstract log(logger: any): void;
}
