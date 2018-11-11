const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
  name: 'dog',
  usage: '',
  description: 'Finds a random dog for your viewing pleasure.',
  tag: 'fun',
  run: async (message) => {
    let img = (await snekfetch.get('https://dog.ceo/api/breeds/image/random')).body.message;
    if (!img) return message.channel.send('I think the puppies need a break. Please try again in a few seconds.');
    let embed = new Discord.RichEmbed()
      .setAuthor('Woof!')
      .setImage(img)
      .setColor(message.client.color);
    message.channel.send(embed);
  }
};
