const Command = require('../Command.js');

module.exports = class BlastCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'blast',
      usage: '',
      description: 'Sends a message to every server that Calypso is in.',
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message, args) {
    const msg = args.join(' ');
    message.client.guilds.forEach(guild => {
      const id = message.client.db.guildSettings.selectDefaultChannelId.pluck().get(guild.id);
      let defaultChannel;
      if (id) defaultChannel = guild.channels.get(id);
      if (defaultChannel) defaultChannel.send(msg);
      else message.channel.send(`Unable to send message in: ${guild.name}`);
    });
  } 
};