const Command = require('../Command.js');
const fetch = require('node-fetch');

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
      const res = await fetch('http://quandyfactory.com/insult/json/');
      const insult = (await res.json()).insult;
      message.channel.send(insult);
    } catch (err) {
      message.client.logger.error(err.stack);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
