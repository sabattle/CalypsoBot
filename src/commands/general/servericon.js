const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class ServerIconCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servericon',
      aliases: ['icon', 'i'],
      usage: '',
      description: 'Displays the server\'s icon.',
      type: 'general'
    });
  }
  run(message) {
    const embed = new Discord.RichEmbed()
      .setTitle(`${message.guild.name}'s Icon`)
      .setImage(message.guild.iconURL)
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
