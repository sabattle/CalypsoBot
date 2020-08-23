const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class DogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dog',
      aliases: ['puppy', 'pup'],
      usage: 'dog',
      description: 'Finds a random dog for your viewing pleasure.',
      type: client.types.FUN
    });
  }
  async run(message) {
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const img = (await res.json()).message;
      const embed = new MessageEmbed()
        .setTitle('🐶  Woof!  🐶')
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
