const Command = require('../Command.js');
const Discord = require('discord.js');
const snekfetch = require('snekfetch');

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
      const img = (await snekfetch.get('https://dog.ceo/api/breeds/image/random')).body.message;
      const embed = new Discord.RichEmbed()
        .setTitle('Woof!')
        .setImage(img)
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.message);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
