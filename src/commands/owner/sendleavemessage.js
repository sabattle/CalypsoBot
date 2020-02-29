const Command = require('../Command.js');

module.exports = class SendLeaveMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sendleavemessage',
      usage: '<TEXT CHANNEL>',
      description: 'Sends the leave message to the specified channel (or the default channel, if none is specified).',
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message) {
    const id = message.client.db.guildSettings.selectDefaultChannelId.pluck().get(message.guild.id);
    let defaultChannel;
    if (id) defaultChannel = message.guild.channels.get(id);
    const target = message.mentions.channels.first() || defaultChannel;
    const msg = message.client.db.guildSettings.selectLeaveMessage.pluck().get(message.guild.id);
    if (msg) target.send(msg);
    else message.channel.send('There is currently no `leave message` set on this server.');
  } 
};