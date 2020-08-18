const { cosmiconfigSync } = require('cosmiconfig');

const moduleName = 'graphql-mocky';

module.exports.getConfig = (filepath) => {
  const exporer = cosmiconfigSync(moduleName, {
    searchPlaces: [
      'package.json',
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yaml`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `.${moduleName}rc.cjs`,
      `${moduleName}.config.js`,
      `${moduleName}.config.cjs`,
      `${moduleName}.config.json`,
      `${moduleName}.config.yaml`,
      `${moduleName}.config.yml`,
      `${moduleName}.json`,
      `${moduleName}.yaml`,
      `${moduleName}.yml`,
    ],
  });

  const config = filepath ? exporer.load(filepath) : exporer.search();

  return config;
};
