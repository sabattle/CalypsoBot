const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servers',
      aliases: ['servs'],
      usage: 'servers',
      description: 'Displays a list of Calypso\'s joined servers.',
      type: types.OWNER,
      ownerOnly: true
    });
  }
  run(message) {

    const servers = message.client.guilds.cache.array().map(guild => {
      return `**${guild.name}** - \`${guild.members.cache.size}\` members`;
    });

    const embed = new MessageEmbed()
      .setTitle(`Server List [${servers.length}]`)
      .setDescription(servers.join('\n'))
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
