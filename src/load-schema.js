const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { join } = require('path');

module.exports.loadSchema = (schemaConfig, log) => {
  schemaConfig =
    typeof schemaConfig === 'string' ? { path: schemaConfig } : schemaConfig;
  if (!schemaConfig || !schemaConfig.path) {
    throw new Error('No schema provided');
  }

  const schemaPath = join(process.cwd(), schemaConfig.path);

  log(`Using schema from ${schemaPath}`);

  return loadSchemaSync(schemaPath, {
    loaders: [new GraphQLFileLoader()],
  });
};
