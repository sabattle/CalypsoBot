const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class CatCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cat',
      aliases: ['kitten', 'kitty'],
      usage: 'cat',
      description: 'Finds a random cat for your viewing pleasure.',
      type: client.types.FUN
    });
  }
  async run(message) {
    const apiKey = message.client.apiKeys.catApi;
    try {
      const res = await fetch('https://api.thecatapi.com/v1/images/search', { headers: { 'x-api-key': apiKey }});
      const img = (await res.json())[0].url;
      const embed = new MessageEmbed()
        .setTitle('🐱  Meow!  🐱')
        .setImage(img)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
    }
  }
};
