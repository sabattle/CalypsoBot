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
        .setColor((await message.guild.fetchMember(message.client.user)).displayHexColor);
      message.channel.send(embed);
    }
    catch (err) {
      return message.channel.send('I think the kittens need a break. Please try again in a few seconds.');
    }
  }
};
