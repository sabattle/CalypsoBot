const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class BlastCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'blast',
      usage: 'blast <message>',
      description: 'Sends a message to every server that Calypso is in that has a default channel.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['blast Hello World!']
    });
  }
  run(message, args) {
    if (!args[0]) return this.sendErrorMessage(message, 'No message provided. Please provide a message for me to say.');
    const msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    const guilds = [];
    message.client.guilds.cache.forEach(guild => {
      const id = message.client.db.settings.selectDefaultChannelId.pluck().get(guild.id);
      let defaultChannel;
      if (id) defaultChannel = guild.channels.cache.get(id);
      if (defaultChannel) defaultChannel.send(msg);
      else guilds.push(guild.name);
    });
    if (guilds.length > 0) {
      const embed = new MessageEmbed()
        .setTitle('Blast Failures')
        .setDescription(`${guilds.join('\n')}`)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    }
  } 
};