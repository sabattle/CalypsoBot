const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SayWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'saywelcomemessage',
      aliases: ['saywm'],
      usage: 'saywelcomemessage [channel mention/ID]',
      description: oneLine`
        Says the currently set welcome message in the provided text channel.
        If no text channel is given, the welcome message will be sent in the current channel.
      `,
      type: client.types.ADMIN,
      examples: ['saywelcomemessage #general'] 
    });
  }
  run(message, args) {
    const welcomeMessage = message.client.db.settings.selectWelcomeMessage.pluck().get(message.guild.id);
    const channel = this.getChannelFromMention(message, args[0]) || 
      message.guild.channels.cache.get(args[0]) || 
      message.channel;
    if (welcomeMessage) channel.send(welcomeMessage);
    else this.sendErrorMessage(message, 'There is currently no `welcome message` set.');
  }
};