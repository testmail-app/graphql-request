import test from 'ava';
import * as fetchMock from 'fetch-mock';
import {
  ClientError,
  rawRequest,
  request
} from '../src/index';

async function mock(response: any, testFn: () => Promise<void>): Promise<void> {
  fetchMock.mock({
    matcher: '*',
    response: {
      headers: {
        'Content-Type': 'application/json',
        ...response.headers
      },
      body: JSON.stringify(response.body)
    }
  });
  await testFn();
  fetchMock.restore();
}

test('minimal query', async (t) => {
  const data = {
    ping: true
  };
  await mock({body: {data}}, async () => {
    t.deepEqual(await request('https://api.testmail.app/api/graphql', `{ ping }`), data);
  });
});

test('minimal raw query with response headers', async (t) => {
  const data = {
    ping: true
  };
  await mock({body: {data}}, async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { headers, ...result } = await rawRequest('https://api.testmail.app/api/graphql', `{ ping }`);
    t.deepEqual(result, {data, status: 200});
    t.deepEqual(headers.get('server'), 'cloudflare');
  });
});

test('content-type with charset', async (t) => {
  const data = {
    ping: true
  };
  await mock({
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    body: {data}
  }, async () => {
    t.deepEqual(await request('https://api.testmail.app/api/graphql', `{ ping }`), data);
  });
});

test('basic error', async (t) => {
  const errors = [{
    extensions: {
      code: 'GRAPHQL_PARSE_FAILED'
    },
    locations: [
      {
        line: 1,
        column: 1
      }
    ],
    message: "Syntax Error: Unexpected Name \"x\""
  }];
  await mock({ body: { errors } }, async () => {
    const err: ClientError = await t.throwsAsync(async () => { return await request('https://api.testmail.app/api/graphql', `x`); });
    t.deepEqual<any>(err.response.errors, errors);
  });
});