const Command = require('../Command.js');
const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = class DogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dog',
      usage: '',
      description: 'Finds a random dog for your viewing pleasure.',
      type: 'fun'
    });
  }
  async run(message) {
    try {
      const img = (await fetch.get('https://dog.ceo/api/breeds/image/random')).body.message;
      const embed = new Discord.MessageEmbed()
        .setTitle('Woof!')
        .setImage(img)
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
