const Discord = require('discord.js');

module.exports = {
  name: 'icon',
  usage: '',
  description: 'Displays the server\'s icon.',
  tag: 'general',
  run: (message, args) => {
    let embed = new Discord.RichEmbed()
      .setAuthor(`${message.guild.name}\'s Icon`)
      .setImage(message.guild.iconURL)
      .setColor(message.client.color);
    message.channel.send(embed);
  }
}
