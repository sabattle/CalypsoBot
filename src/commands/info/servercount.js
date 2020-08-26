const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ServerCountCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servercount',
      aliases: ['sc'],
      usage: 'servercount',
      description: 'Fetches Calypso\'s current server count.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle('Calypso\'s Server Count')
      .setDescription(`\`\`\`prolog\nCurrent Servers: ${message.client.guilds.cache.size}\`\`\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
