# @testmail.app/graphql-request

**This package is "under construction"! Please check back in a few days.**

A **clone** of [graphql-request](https://github.com/prisma-labs/graphql-request) (a minimal GraphQL client supporting Node and browsers for scripts or simple apps) with added features like retries.

## Features

### graphql-request

- Most **simple and lightweight** GraphQL client
- Promise-based API (works with `async` / `await`)
- Typescript support (Flow coming soon)

### Added

- Configurable retries
- API remains compatible with [graphql-request](https://github.com/prisma-labs/graphql-request) (no breaking changes)

## Install

```sh
npm install @testmail.app/graphql-request
```

## Quickstart

Send a GraphQL query with a single line of code. ▶️ [Try it out](https://runkit.com/593130bdfad7120012472003/593130bdfad7120012472004).

```js
import { request } from '@testmail.app/graphql-request'

const query = `{
  Movie(title: "Inception") {
    releaseDate
    actors {
      name
    }
  }
}`

request('https://api.graph.cool/simple/v1/movies', query).then(data =>
  console.log(data)
)
```

## Usage

```js
import { request, GraphQLClient } from '@testmail.app/graphql-request'

// Run GraphQL queries/mutations using a static function
request(endpoint, query, variables).then(data => console.log(data))

// ... or create a GraphQL client instance to send requests
const client = new GraphQLClient(endpoint, { headers: {} })
client.request(query, variables).then(data => console.log(data))
```

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

[TypeScript Source](examples/authentication-via-http-header.ts)

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

[TypeScript Source](examples/passing-more-options-to-fetch.ts)

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

[TypeScript Source](examples/using-variables.ts)

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

[TypeScript Source](examples/error-handling)

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

### Cookie support for `node`

```sh
npm install fetch-cookie
```

```js
require('fetch-cookie/node-fetch')(require('node-fetch'))

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

  const data = await graphQLClient.rawRequest(query)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch(error => console.error(error))
```

[TypeScript Source](examples/cookie-support-for-node)

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

[TypeScript Source](examples/receiving-a-raw-response)
