const Command = require('../Command.js');
const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class CatCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cat',
      usage: '',
      description: 'Finds a random cat for your viewing pleasure.',
      type: 'fun'
    });
  }
  async run(message) {
    try {
      const img = (await snekfetch.get('http://aws.random.cat/meow')).body.file; // Need to change api
      const embed = new Discord.RichEmbed()
        .setAuthor('Meow!')
        .setImage(img)
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    }
    catch (err) {
      message.client.logger.error(err.message);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
