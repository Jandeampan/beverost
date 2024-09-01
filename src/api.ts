/**
 * @module ApiService
 * @description This module provides functionality for managing API endpoints and making HTTP requests.
 */

import { ApiError, NetworkError } from './errors';
import { Logger } from './logger';

/**
 * Represents an API endpoint with its properties.
 * @typedef {Object} ApiEndpoint
 * @property {string} id - Unique identifier for the endpoint.
 * @property {string} name - Human-readable name for the endpoint.
 * @property {string} url - The URL of the endpoint.
 */
interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
}

/**
 * Service class for managing API endpoints and making HTTP requests.
 * @class
 */
export class ApiService {
  /**
   * Map to store API endpoints.
   * @private
   * @type {Map<string, ApiEndpoint>}
   */
  private endpoints: Map<string, ApiEndpoint> = new Map();

  /**
   * Logger instance for logging API-related activities.
   * @private
   * @type {Logger}
   */
  private logger: Logger;

  /**
   * Creates an instance of ApiService.
   * @constructor
   * @param {Logger} logger - The logger instance to use for logging API-related activities.
   */
  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Adds a new API endpoint to the service.
   * @method
   * @param {string} id - Unique identifier for the endpoint.
   * @param {string} name - Human-readable name for the endpoint.
   * @param {string} url - The URL of the endpoint.
   * @throws {Error} If an endpoint with the same ID already exists.
   */
  addEndpoint(id: string, name: string, url: string): void {
    if (this.endpoints.has(id)) {
      throw new Error(`Endpoint with ID '${id}' already exists.`);
    }
    this.endpoints.set(id, { id, name, url });
    this.logger.info(`Added new endpoint: ${name} (${id})`);
  }

  /**
   * Fetches data from a specified API endpoint.
   * @method
   * @async
   * @param {string} endpointId - The ID of the endpoint to fetch from.
   * @param {RequestInit} [options] - Optional fetch options to customize the request.
   * @returns {Promise<any>} The parsed JSON response from the API.
   * @throws {ApiError} If the endpoint is not found or the API request fails.
   * @throws {NetworkError} If there's a network-related error during the fetch operation.
   * 
   * @example
   * try {
   *   const data = await apiService.fetch('users', { method: 'GET' });
   *   console.log(data);
   * } catch (error) {
   *   console.error('Failed to fetch data:', error);
   * }
   */
  async fetch(endpointId: string, options?: RequestInit): Promise<any> {
    const endpoint = this.endpoints.get(endpointId);
    if (!endpoint) {
      this.logger.error(`Endpoint not found: ${endpointId}`);
      throw new ApiError(404, `Endpoint not found: ${endpointId}`);
    }

    try {
      this.logger.info(`Fetching from endpoint: ${endpoint.name}`);
      const response = await fetch(endpoint.url, options);
      if (!response.ok) {
        this.logger.error(`API request failed: ${response.statusText}`, { status: response.status });
        throw new ApiError(response.status, `API request failed: ${response.statusText}`);
      }
      const data = await response.json();
      this.logger.info(`Successfully fetched data from ${endpoint.name}`);
      return data;
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }
      const networkError = new NetworkError(
        `Network error while fetching ${endpoint.name}`,
        error instanceof Error ? error.message : String(error)
      );
      this.logger.error(networkError.message, { endpointName: endpoint.name });
      throw networkError;
    }
  }
}