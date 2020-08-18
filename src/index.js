const { Command, flags } = require('@oclif/command');
const { serve } = require('./server');
const { getConfig } = require('./config');
const { mergeDeep } = require('./merge-deep');

class GraphqlMockerCommand extends Command {
  async run() {
    const { flags } = this.parse(GraphqlMockerCommand);
    const debug = flags.debug;
    const cliFlagConfig = {
      port: flags.port,
      graphiql: flags.graphiql,
      schema: flags.schema,
    };

    const configWrapper = getConfig(flags.config);
    let config;
    if (!configWrapper || configWrapper.isEmpty) {
      config = {};
    } else {
      this.log(`Using config from ${configWrapper.filepath}`);
      config = configWrapper.config;
    }

    const mergedConfig = mergeDeep({}, config, cliFlagConfig);

    if (debug) {
      this.log('Config from file:');
      this.log(config);
      this.log('Config from CLI args:');
      this.log(cliFlagConfig);
      this.log('Merged config:');
      this.log(mergedConfig);
    }

    serve(mergedConfig, this.log);
  }
}

GraphqlMockerCommand.description = `Mock GraphQL APIs with ease!
...
Starts an HTTP server with a mock GraphQL endpoint based on the provided schema.
`;

GraphqlMockerCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: 'v' }),
  // add --help flag to show CLI version
  help: flags.help({ char: 'h' }),
  config: flags.string({
    description: 'Path to config file',
  }),
  port: flags.integer({
    description: 'Port to bind to (default 3000)',
    char: 'p',
  }),
  graphiql: flags.boolean({
    description: 'Enable Graphiql UI (enabled by default)',
  }),
  schema: flags.string({
    description: 'Path to schema',
  }),
  debug: flags.boolean({
    description: 'Print config and additional debug info',
  }),
};

module.exports = GraphqlMockerCommand;
