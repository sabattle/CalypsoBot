const Command = require('../Command.js');

module.exports = class ShowCrownMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'showcrownmessage',
      aliases: ['showcm', 'shcm'],
      usage: '',
      description: 'Shows the crown message for your server.',
      type: 'admin'
    });
  }
  run(message) {
    const msg = message.client.db.guildSettings.selectCrownMessage.pluck().get(message.guild.id);
    if (msg) message.channel.send(msg);
    else message.channel.send('There is currently no `crown message` set on this server.');
  } 
};