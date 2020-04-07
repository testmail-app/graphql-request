# @testmail.app/graphql-request

![GitHubCI](https://github.com/testmail-app/graphql-request/workflows/ci/badge.svg)] [![npm version](https://badge.fury.io/js/%40testmail.app%2Fgraphql-request.svg)](https://badge.fury.io/js/%40testmail.app%2Fgraphql-request)

Clone of [graphql-request](https://github.com/prisma-labs/graphql-request) (minimal GraphQL client) with improvements like built-in retries.

## Highlights

- **Simple and lightweight** GraphQL client with a promise-based API (works with `async` / `await`) and typescript support
- API compatible with [graphql-request](https://github.com/prisma-labs/graphql-request) (no breaking changes; drop-in replacement)
- Configurable retries (see docs below)

## Install

```sh
npm install @testmail.app/graphql-request
```

## Quickstart

```js
import { request } from '@testmail.app/graphql-request'

const query = `{
  Movie(title: "Inception") {
    releaseDate
    actors {
      name
    }
  }
}`;

request('https://api.graph.cool/simple/v1/movies', query).then(data =>
  console.log(data)
);
```

## Usage (with retries)

```js
import { request, GraphQLClient } from '@testmail.app/graphql-request'

// Run GraphQL queries/mutations using a static function
request(endpoint, query, variables).then(data => console.log(data));

// ... or create a GraphQL client instance to send requests
const client = new GraphQLClient(endpoint, { headers: {} });
client.request(query, variables).then(data => console.log(data));

// This is the default retry policy:
const client = new GraphQLClient(endpoint, {
  retries: 9,
  retryDelay: function (attempt) {
    // Exponential backoff: 1s, 2s, 4s, etc. upto 40s (max)
    return Math.min(Math.pow(2, attempt) * 1000, 40000);
  },
  retryOn: [500, 502, 503, 504] // response status codes to retry on
  // network connection errors are always retried
});
```

To override the default retry policy, replace any of those three arguments: `retries`, `retryDelay`, and `retryOn`.

The options object (2nd argument to GraphQLClient constructor) passes along any additional parameters to [fetch](https://github.github.io/fetch/) - so you can easily configure the underlying fetch API :)

## Examples

### Authentication via HTTP header

```js
import { GraphQLClient } from '@testmail.app/graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer MY_TOKEN',
    },
  })

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const data = await graphQLClient.request(query)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch(error => console.error(error))
```

### Passing more options to fetch

```js
import { GraphQLClient } from '@testmail.app/graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const graphQLClient = new GraphQLClient(endpoint, {
    credentials: 'include',
    mode: 'cors',
  })

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const data = await graphQLClient.request(query)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch(error => console.error(error))
```

### Using variables

```js
import { request } from '@testmail.app/graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = /* GraphQL */ `
    query getMovie($title: String!) {
      Movie(title: $title) {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const variables = {
    title: 'Inception',
  }

  const data = await request(endpoint, query, variables)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch(error => console.error(error))
```

### Error handling

```js
import { request } from '@testmail.app/graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          fullname # "Cannot query field 'fullname' on type 'Actor'. Did you mean 'name'?"
        }
      }
    }
  `

  try {
    const data = await request(endpoint, query)
    console.log(JSON.stringify(data, undefined, 2))
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
    process.exit(1)
  }
}

main().catch(error => console.error(error))
```

### Using `require` instead of `import`

```js
const { request } = require('graphql-request')

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const data = await request(endpoint, query)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch(error => console.error(error))
```

### Receiving a raw response

The `request` method will return the `data` or `errors` key from the response.
If you need to access the `extensions` key you can use the `rawRequest` method:

```js
import { rawRequest } from '@testmail.app/graphql-request'

async function main() {
  const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

  const query = /* GraphQL */ `
    {
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }
  `

  const { data, errors, extensions, headers, status } = await rawRequest(
    endpoint,
    query
  )
  console.log(
    JSON.stringify({ data, errors, extensions, headers, status }, undefined, 2)
  )
}

main().catch(error => console.error(error))
```
