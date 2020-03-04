const Command = require('../Command.js');
const snekfetch = require('snekfetch');

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
      const res = (await snekfetch.get('https://catfact.ninja/fact')).body.fact;
      message.channel.send(res);
    } catch (err) {
      message.client.logger.error(err.message);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
