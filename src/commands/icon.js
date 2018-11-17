const Discord = require('discord.js');

module.exports = {
  name: 'icon',
  usage: '',
  description: 'Displays the server\'s icon.',
  tag: 'general',
  run: async (message) => {
    const embed = new Discord.RichEmbed()
      .setAuthor(`${message.guild.name}'s Icon`)
      .setImage(message.guild.iconURL)
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
