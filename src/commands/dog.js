const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
  name: 'dog',
  usage: '',
  description: 'Calypso will find a random pup for your viewing pleasure.',
  tag: 'fun',
  run: async (message, args) => {
    let img = (await snekfetch.get('https://dog.ceo/api/breeds/image/random')).body.message;
    if (!img) return message.channel.send('Yikes, I think the puppies are on the fritz! Try again in a few seconds.')
    let embed = new Discord.RichEmbed()
      .setAuthor('Woof!')
      .setImage(img)
      .setColor(message.client.color);
    message.channel.send(embed);
  }
}
