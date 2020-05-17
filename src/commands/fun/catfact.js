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
      const res = (await fetch.get('https://catfact.ninja/fact')).body.fact;
      message.channel.send(res);
    } catch (err) {
      message.client.logger.error(err.stack);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
