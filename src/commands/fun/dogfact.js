const Command = require('../Command.js');
const fetch = require('node-fetch');

module.exports = class DogFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dogfact',
      aliases: ['df'],
      usage: '',
      description: 'Says a random dog fact.',
      type: 'fun'
    });
  }
  async run(message) {
    try {
      const res = await fetch('https://dog-api.kinduff.com/api/facts');
      const fact = (await res.json()).facts[0];
      message.channel.send(fact);
    } catch (err) {
      message.client.logger.error(err.stack);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
