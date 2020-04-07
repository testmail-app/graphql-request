import nock = require('nock');
import { expect, use as chaiUsePlugin } from 'chai';
import chaiAsPromised = require('chai-as-promised');
chaiUsePlugin(chaiAsPromised);

import {
  ClientError,
  rawRequest,
  request,
  GraphQLClient
} from '../src/index';

// test settings

const testURL = 'https://api.testmail.app/api/graphql';
const testQuery = '{ ping }';
const testResponse = { ping: true };
const errorQuery = 'x';
const errorResponse = {
  errors: [{
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
  }]
};

// tests

describe('test suite', function() {
  describe('basic tests', function () {
    before(function() {
      // ping queries
      nock('https://api.testmail.app')
        .persist()
        .post('/api/graphql', { query: testQuery })
        .reply(200, JSON.stringify({ data: testResponse }), {
          'Content-Type': 'application/json',
          'Server': 'cloudflare'
        });
      // error queries
      nock('https://api.testmail.app')
        .persist()
        .post('/api/graphql', { query: 'x' })
        .reply(200, JSON.stringify(errorResponse), {
          'Content-Type': 'application/json',
          'Server': 'cloudflare'
        });
    });
    after(function() {
      nock.cleanAll();
    });
    it('minimal query', function() {
      return expect(request(testURL, testQuery)).to.eventually.deep.equal(testResponse);
    });
    it('minimal raw query with response headers', async function() {
      const { headers, ...result } = await rawRequest(testURL, testQuery);
      expect(result).to.deep.equal({ data: testResponse, status: 200 });
      expect(headers.get('content-type')).to.contain('application/json');
      expect(headers.get('server')).to.deep.equal('cloudflare');
    });
    it('basic error', async function() {
      let err: ClientError | undefined;
      try {
        await request(testURL, errorQuery);
      } catch(e) {
        err = e;
      }
      expect(err?.response.errors).to.deep.equal(errorResponse.errors);
    });
  });
  describe('retry tests', function () {
    afterEach(function () {
      nock.cleanAll();
    });
    it('minimal query with 500 status and 0 retries', function () {
      nock('https://api.testmail.app')
        .persist()
        .post('/api/graphql')
        .reply(500, 'Internal Server Error');
      const client = new GraphQLClient(testURL, { retries: 0 });
      return expect(client.request(testQuery)).to.eventually.be.rejectedWith();
    });
    it('minimal query with 502 status and 2 retries', async function () {
      this.timeout(5000); // 5s
      nock('https://api.testmail.app')
        .persist()
        .post('/api/graphql')
        .reply(502, 'Internal Server Error');
      const client = new GraphQLClient(testURL, { retries: 2 });
      let err: ClientError | undefined;
      const startTimestamp = Date.now();
      try {
        await client.request(testQuery);
      } catch (e) {
        err = e;
      }
      expect(err?.response.status).to.equal(502);
      // testing retry delay: 1s (retry 1) + 2s (retry 2) = 3s
      expect(Math.round((Date.now() - startTimestamp) / 1000)).to.equal(3);
    });
    it('minimal query with network offline and 0 retries', async function () {
      const client = new GraphQLClient(testURL, { retries: 0 });
      nock.disableNetConnect();
      return expect(client.request(testQuery)).to.eventually.be.rejectedWith();
    });
    it('minimal query with network offline and default retries', async function () {
      this.timeout(5000); // 5s
      const client = new GraphQLClient(testURL);
      nock.disableNetConnect();
      const startTimestamp = Date.now();
      setTimeout(() => {
        nock.enableNetConnect();
      }, 2000); // after 2s
      expect(await client.request(testQuery)).to.deep.equal(testResponse);
      // it should have taken at least 2s (offline time)
      expect((Date.now() - startTimestamp) > 2000).to.equal(true);
    });
  });
});
