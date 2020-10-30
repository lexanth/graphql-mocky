const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const { addMocksToSchema, MockList } = require('@graphql-tools/mock');
const casual = require('casual');
const { loadSchema } = require('./load-schema');

const DEFAULT_PORT = 3000;
const DEFAULT_MOCKS = {
  String: () => casual.title,
  Int: () => casual.integer(),
  Float: () => casual.double(),
  Date: () => casual.date('YYYY-MM-DD'),
  DateTime: () => casual.date('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
  Boolean: () => casual.coin_flip,
  ID: () => casual.uuid,
  UUID: () => casual.uuid,
};

const MOCK_LIST_REGEX = /^mockList\((.*)\)$/;

const buildMock = (value, key) => {
  if (value === null) {
    return () => null;
  }
  if (typeof value === 'function') {
    return () => value(key);
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    // eslint-disable-next-line no-use-before-define
    return () => buildMocks(value);
  }
  if (typeof value === 'string') {
    if (value.startsWith('casual.')) {
      // eslint-disable-next-line no-eval
      return () => eval(value);
    }
    if (MOCK_LIST_REGEX.test(value)) {
      const args = MOCK_LIST_REGEX.exec(value)[1]
        .split(',')
        .map((arg) => parseInt(arg, 10));

      return () => new MockList(args.length === 1 ? args[0] : args);
    }
  }

  return () => value;
};

const buildMocks = (mocks) =>
  Object.fromEntries(
    Object.entries(mocks).map(([key, value]) => [key, buildMock(value, key)]),
  );

module.exports.serve = (config, log) => {
  const customMocks = config.mocks ? buildMocks(config.mocks) : {};

  const port = config.port || DEFAULT_PORT;
  // eslint-disable-next-line no-eq-null
  const useGraphiql = config.graphiql == null ? true : config.graphiql;
  const mocks = { ...DEFAULT_MOCKS, ...customMocks };

  const schema = loadSchema(config.schema, log);

  // Validate custom mocks
  Object.keys(customMocks).forEach((mockKey) => {
    if (!schema.getType(mockKey)) {
      throw new Error(`Unknown mock key ${mockKey}`);
    }
  });

  const app = express();

  // eslint-disable-next-line no-eq-null
  const path = config.path == null ? '/graphql' : config.path;
  app.use(
    path,
    graphqlHTTP({
      schema: addMocksToSchema({ schema, mocks }),
      graphiql: useGraphiql,
    }),
  );

  if (config.healthcheck) {
    app.get(config.healthcheck.path, (req, res) =>
      res.send(config.healthcheck.result),
    );
  }

  app.get('/', (req, res) => res.redirect(path));

  app.listen(port, () => {
    log(`Listening on ${port}`);
  });
};
