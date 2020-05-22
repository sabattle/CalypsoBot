const Command = require('../Command.js');
const Discord = require('discord.js');
const fetch = require('node-fetch');

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
    const apiKey = message.client.apiKeys.catApi;
    try {
      const img = (await fetch.get('https://api.thecatapi.com/v1/images/search', {
        headers: { 'x-api-key': apiKey }
      })).body[0].url;
      const embed = new Discord.MessageEmbed()
        .setTitle('Meow!')
        .setImage(img)
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
