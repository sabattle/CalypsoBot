const Command = require('../Command.js');
const fetch = require('node-fetch');

module.exports = class CatFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'catfact',
      aliases: ['cf'],
      usage: '',
      description: 'Says a random cat fact.',
      type: 'fun'
    });
  }
  async run(message) {
    try {
      const res = await fetch('https://catfact.ninja/fact');
      const fact = (await res.json()).fact;
      message.channel.send(fact);
    } catch (err) {
      message.client.logger.error(err.stack);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
