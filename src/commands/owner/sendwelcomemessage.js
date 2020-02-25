const Command = require('../Command.js');

module.exports = class SendWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sendwelcomemessage',
      usage: '<TEXT CHANNEL>',
      description: 'Sends the welcome message to the specified channel (or the default channel, if none is specified).',
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message) {
    const id = message.client.db.guildSettings.selectDefaultChannelId.pluck().get(message.guild.id);
    let defaultChannel;
    if (id) defaultChannel = message.guild.channels.get(id);
    const target = message.mentions.channels.first() || defaultChannel;
    const msg = message.client.db.guildSettings.selectWelcomeMessage.pluck().get(message.guild.id);
    if (msg) target.send(msg);
  } 
};