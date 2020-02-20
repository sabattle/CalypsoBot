const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      usage: '',
      description: 'Gets Calypso\'s current ping.',
      type: 'general'
    });
  }
  async run(message) {
    const msg = await message.channel.send('Pinging....');
    msg.edit(oneLine`
      🏓 Pong! Latency is **${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms**.
      API Latency is **${Math.round(message.client.ping)}ms**.
    `);
  }
};
