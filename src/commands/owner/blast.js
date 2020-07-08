const Command = require('../Command.js');

module.exports = class BlastCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'blast',
      usage: '',
      description: 'Sends a message to every server that Calypso is in.',
      type: types.OWNER,
      ownerOnly: true
    });
  }
  run(message, args) {
    const msg = args.join(' ');
    message.client.guilds.cache.forEach(guild => {
      const id = message.client.db.settings.selectDefaultChannelId.pluck().get(guild.id);
      let defaultChannel;
      if (id) defaultChannel = guild.channels.cache.get(id);
      if (defaultChannel) defaultChannel.send(msg);
      else message.channel.send(`Unable to send message in: ${guild.name}`);
    });
  } 
};