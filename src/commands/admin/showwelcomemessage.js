const Command = require('../Command.js');

module.exports = class ShowWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'showwelcomemessage',
      aliases: ['showwm', 'shwm'],
      usage: '',
      description: 'Shows the welcome message for your server.',
      type: 'admin'
    });
  }
  run(message) {
    const msg = message.client.db.guildSettings.selectWelcomeMessage.pluck().get(message.guild.id);
    if (msg) message.channel.send(msg);
    else message.channel.send('There is currently no `welcome message` set on this server.');
  } 
};