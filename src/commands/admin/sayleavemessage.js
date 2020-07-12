const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SayLeaveMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sayleavemessage',
      aliases: ['saylm'],
      usage: 'sayleavemessage [channel mention/ID]',
      description: oneLine`
        Says the currently set leave message in the provided text channel.
        If no text channel is given, the leave message will be sent in the current channel.
      `,
      type: client.types.ADMIN,
      examples: ['sayleavemessage #general'] 
    });
  }
  run(message, args) {
    const leaveMessage = message.client.db.settings.selectLeaveMessage.pluck().get(message.guild.id);
    const channel = this.getChannelFromMention(message, args[0]) || 
      message.guild.channels.cache.get(args[0]) || 
      message.channel;
    if (leaveMessage) channel.send(leaveMessage);
    else this.sendErrorMessage(message, 'There is currently no `leave message` set.');
  }
};