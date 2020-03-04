const Command = require('../Command.js');
const snekfetch = require('snekfetch');

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
      const res = (await snekfetch.get('https://dog-api.kinduff.com/api/facts')).body.facts[0];
      message.channel.send(res);
    } catch (err) {
      message.client.logger.error(err.message);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
