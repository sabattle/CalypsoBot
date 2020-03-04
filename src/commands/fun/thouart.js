const Command = require('../Command.js');
const snekfetch = require('snekfetch');

module.exports = class ThouArtCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'thouart',
      aliases: ['elizabethan', 'ta'],
      usage: '',
      description: 'Says a random Elizabethan insult.',
      type: 'fun'
    });
  }
  async run(message) {
    try {
      const res = (await snekfetch.get('http://quandyfactory.com/insult/json/')).body.insult;
      message.channel.send(res);
    } catch (err) {
      message.client.logger.error(err.message);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
