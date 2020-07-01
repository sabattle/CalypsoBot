const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class ServerIconCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servericon',
      aliases: ['icon', 'i'],
      usage: 'servericon',
      description: 'Displays the server\'s icon.',
      type: 'general'
    });
  }
  run(message) {
    const embed = new Discord.MessageEmbed()
      .setTitle(`${message.guild.name}'s Icon`)
      .setImage(message.guild.iconURL({ size: 512 }))
      .setFooter(`Requested by ${message.member.displayName}#${message.author.discriminator}`, 
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
