const config = require('./config.json');
const Client = require('./src/Client.js');
global.__basedir = __dirname;

// setup
const client = new Client(config);

// initialize client
init() = async () => {
  await client.loadEvents('./src/events');
  await client.loadCommands('./src/commands');
  await client.loadTopics('./data/trivia');
  await client.login(client.token);
};

(async () => {
  await init();
})();
