# graphql-mocky

Mock GraphQL APIs with ease!

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/graphql-mocky.svg)](https://npmjs.org/package/graphql-mocky)
[![Downloads/week](https://img.shields.io/npm/dw/graphql-mocky.svg)](https://npmjs.org/package/graphql-mocky)
[![License](https://img.shields.io/npm/l/graphql-mocky.svg)](https://github.com/lexanth/graphql-mocky/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Config](#config)
<!-- tocstop -->

# Usage

<!-- usage -->

## Ways of running

From all of these methods, the GraphQL server (and Graphiql, if enabled) will be available at `/graphql` (e.g. `http://localhost:3000/graphql`).

### Docker

A simple docker file is provided (to be published). You can then add in your config and schema (if required), either as a bind mount volume or as another layer.

e.g.

```
FROM alex/graphql-mocky
COPY .graphql-mockyrc schema.graphql ./
```

NB: the image is not published yet! So you'll have to build yourself from the provided root Dockerfile.

By default, the application listens to port 3000, so map that to a local port etc.

### Package

Install (globally or locally) or run the `graphql-mocky` NPM package:

```sh-session
$ npm install -g graphql-mocky
$ yarn global add graphql-mocky
$ graphql-mocky
running command...
# Or
$ npx graphql-mocky
```

### Programmatically

Install the `graphql-mocky` package and import `graphql-mocky/server`. This API is subject to change though.

## Arguments

CLI arguments override the config file.

### `port`

### `schema`

### `graphiql`

<!-- usagestop -->

# Config

A schema must be provided. This can be either provided as config or a CLI argument:

```sh-session
graphql-mocky --schema ./schema.graphql
```

Cosmiconfig is used for reading a config file, which allows the mocking to be customised. The following places will be searched:

- package.json (`graphql-mocky` key)
- .graphql-mockyrc (YAML or JSON)
- .graphql-mockyrc.[json|yaml|yml|js|cjs]
- graphql-mocky.config.[json|yaml|yml|js|cjs]
- graphql-mocky.[json|yaml|yml]

The schema for all is the same:

## `schema`

The path to a schema. Currently only relative paths are supported (this is next on the list).

## `port`

The port to bind the HTTP server to. Defaults to 3000.

## `graphiql`

Enable/disable the Graphiql UI. Defaults to true.

## `mocks`

Customise the mocking. By default, the GraphQL primitives (strings, numbers, booleans) are randomly assigned using `casual`.

Keys correspond to either GraphQL primitives (`String`, `Int`, `Float`, `Boolean` or `ID`), custom scalars or types from the schema.

```yaml
mocks:
  String: Hello world
  Query:
    books: mockList(10)
  Book:
    name: casual.title
    sales: casual.integer(1000, 50000)
```

Values can be specified in several ways:

- Literals
  If a literal value is used, it is returned directly
- casual
  If a string starting with `casual.` is used, the corresponding [casual](https://github.com/boo1ean/casual#readme) function is called.
- Mock list
  Use `mockList(10)` or `mockList(1, 5)` to control the number of items in a list (otherwise random)
- Functions
  If using a `.js` format for config, you can specify a function which will be called automatically

## `path`

The URL path to run at. Defaults to `/graphql`.

## `healthcheck`

Adds a healthcheck endpoint to the server. This will respond to HTTP GET requests. Disabled by default.

### `healthcheck.path`

URL path for the healthcheck endpoint.

### `healthecheck.result`

What to send back to the healthcheck endpoint.

<!-- configstop -->
