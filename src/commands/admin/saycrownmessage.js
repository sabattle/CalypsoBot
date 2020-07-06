const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SayCrownMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'saycrownmessage',
      aliases: ['saycm'],
      usage: 'saycrownmessage [text channel mention/ID]',
      description: oneLine`
        Says the currently set crown message in the provided text channel.
        If no text channel is given, the crown message will be sent in the current channel.
      `,
      type: 'admin',
      examples: ['saycrownmessage #general'] 
    });
  }
  run(message, args) {
    const crownMessage = message.client.db.settings.selectCrownMessage.pluck().get(message.guild.id);
    const channel = this.getChannelFromMention(message, args[0]) || 
      message.guild.channels.cache.get(args[0]) || 
      message.channel;
    if (crownMessage) channel.send(crownMessage);
    else this.sendErrorMessage(message, 'There is currently no `crown message` set.');
  }
};