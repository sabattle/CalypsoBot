const Command = require('../Command.js');

module.exports = class SendWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sendwelcomemessage',
      aliases: ['sendwm'],
      usage: '<CHANNEL MENTION>',
      description: 'Sends the welcome message to the specified channel (or the default channel, if none is specified).',
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message, args) {
    const id = message.client.db.guildSettings.selectDefaultChannelId.pluck().get(message.guild.id);
    let defaultChannel;
    if (id) defaultChannel = message.guild.channels.get(id);
    const channel = this.getChannelFromMention(message, args[0]) || defaultChannel;
    const msg = message.client.db.guildSettings.selectWelcomeMessage.pluck().get(message.guild.id);
    if (msg) channel.send(msg);
    else message.channel.send('There is currently no `welcome message` set on this server.');
  } 
};