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
      .setColor((await message.guild.fetchMember(message.client.user)).displayHexColor);
    message.channel.send(embed);
  }
};
