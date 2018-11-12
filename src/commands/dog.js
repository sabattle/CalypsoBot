const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
  name: 'dog',
  usage: '',
  description: 'Finds a random dog for your viewing pleasure.',
  tag: 'fun',
  run: async (message) => {
    try {
      const img = (await snekfetch.get('https://dog.ceo/api/breeds/image/random')).body.message;
      const embed = new Discord.RichEmbed()
        .setAuthor('Woof!')
        .setImage(img)
        .setColor(message.client.color);
      message.channel.send(embed);
    }
    catch (err) {
      return message.channel.send('I think the puppies need a break. Please try again in a few seconds.');
    }
  }
};
