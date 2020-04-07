import fetch from 'cross-fetch';
import FetchRetry = require('fetch-retry');
const fetchRetry = FetchRetry(fetch);

import {
  ClientError,
  Headers as HttpHeaders,
  Options,
  Variables,
  RawResult
} from './types';

// helper functions

async function getResult(response: Response): Promise<any> {
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.startsWith('application/json')) {
    return response.json();
  } else {
    return response.text();
  }
}

// exports

export class GraphQLClient {
  private url: string;
  private options: Options;

  constructor(url: string, options?: Options) {
    this.url = url;
    this.options = Object.assign({
      retries: 9,
      retryDelay: function (attempt: number) {
        // 1s, 2s, 4s, etc. upto 40s (max)
        return Math.min(Math.pow(2, attempt) * 1000, 40000);
      },
      retryOn: [500, 502, 503, 504]
    }, options);
  }

  async rawRequest<T extends any>(query: string, variables?: Variables): Promise<RawResult<T>> {
    const { headers, ...others } = this.options;

    const body = JSON.stringify({
      query,
      variables: variables ? variables : undefined
    });

    const response = await fetchRetry(this.url, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
      body,
      ...others
    });

    const result = await getResult(response);

    if (response.ok && !result.errors && result.data) {
      const { headers, status } = response;
      return { ...result, headers, status };
    } else {
      const errorResult = (typeof result === 'string') ? { error: result } : result;
      throw new ClientError(
        { ...errorResult, status: response.status, headers: response.headers },
        { query, variables }
      );
    }
  }

  async request<T extends any>(query: string, variables?: Variables): Promise<T> {
    return (await this.rawRequest(query, variables)).data;
  }

  setHeaders(headers: HttpHeaders): GraphQLClient {
    this.options.headers = headers;
    return this;
  }

  setHeader(key: string, value: string): GraphQLClient {
    const { headers } = this.options;
    if (headers) {
      headers[key] = value;
    } else {
      this.options.headers = { [key]: value };
    }
    return this;
  }
}

export async function rawRequest<T extends any>(url: string, query: string, variables?: Variables): Promise<RawResult<T>> {
  const client = new GraphQLClient(url);
  return client.rawRequest<T>(query, variables);
}

export async function request<T extends any>(url: string, query: string, variables?: Variables): Promise<T> {
  const client = new GraphQLClient(url);
  return client.request<T>(query, variables);
}

export { ClientError } from './types';

export default request;
