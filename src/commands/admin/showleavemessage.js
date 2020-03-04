const Command = require('../Command.js');

module.exports = class ShowLeaveMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'showleavemessage',
      aliases: ['showlm', 'shlm'],
      usage: '',
      description: 'Shows the leave message for your server.',
      type: 'admin'
    });
  }
  run(message) {
    const msg = message.client.db.guildSettings.selectLeaveMessage.pluck().get(message.guild.id);
    if (msg) message.channel.send(msg);
    else message.channel.send('There is currently no `leave message` set on this server.');
  } 
};