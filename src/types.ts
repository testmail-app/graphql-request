export type Variables = { [key: string]: any }

export interface Headers {
  [key: string]: string;
}

// RequestDelayFunction and Options taken from https://github.com/jonbern/fetch-retry/blob/master/index.d.ts

type RequestDelayFunction = ((
  attempt: number,
  error: Error | null,
  response: Response | null
) => number);

export interface Options extends RequestInit {
  retries?: number;
  retryDelay?: number | RequestDelayFunction;
  retryOn?: number[];
}

export interface GraphQLError {
  message: string;
  locations: { line: number; column: number }[];
  path: string[];
}

export interface GraphQLResponse {
  data?: any;
  errors?: GraphQLError[];
  extensions?: any;
  status: number;
  [key: string]: any;
}

export interface GraphQLRequestContext {
  query: string;
  variables?: Variables;
}

export class ClientError extends Error {
  response: GraphQLResponse;
  request: GraphQLRequestContext;

  constructor (response: GraphQLResponse, request: GraphQLRequestContext) {
    const message = `${ClientError.extractMessage(response)}: ${JSON.stringify({ response, request })}`;
    super(message);
    this.response = response;
    this.request = request;
    // this is needed as Safari doesn't support .captureStackTrace
    /* tslint:disable-next-line */
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, ClientError);
    }
  }

  private static extractMessage (response: GraphQLResponse): string {
    if (response.errors) {
      return response.errors[0].message;
    }
    return `GraphQL Error (Code: ${response.status})`;
  }
}

export type RawResult<T> = {
  data?: T;
  extensions?: any;
  headers: Response['headers'];
  status: number;
  errors?: GraphQLError[];
}
