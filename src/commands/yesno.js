const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
  name: 'yesno',
  usage: '',
  description: 'Fetches a gif of a yes or a no.',
  tag: 'fun',
  run: async (message) => {
    try {
      const res = (await snekfetch.get('http://yesno.wtf/api/')).body;
      const embed = new Discord.RichEmbed()
        .setAuthor(res.answer + '!')
        .setImage(res.image)
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    }
    catch (err) {
      return message.channel.send('Something went wrong, please try again in a few seconds.');
    }
  }
};
