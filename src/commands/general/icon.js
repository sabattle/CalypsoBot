const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class IconCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'icon',
      usage: '',
      description: 'Displays the server\'s icon.',
      type: 'general'
    });
  }
  run(message) {
    const embed = new Discord.RichEmbed()
      .setAuthor(`${message.guild.name}'s Icon`)
      .setImage(message.guild.iconURL)
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
