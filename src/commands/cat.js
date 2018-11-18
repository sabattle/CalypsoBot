const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
  name: 'cat',
  usage: '',
  description: 'Finds a random cat for your viewing pleasure.',
  tag: 'fun',
  run: async (message) => {
    try {
      const img = (await snekfetch.get('http://aws.random.cat/meow')).body.file;
      const embed = new Discord.RichEmbed()
        .setAuthor('Meow!')
        .setImage(img)
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    }
    catch (err) {
      return message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
