const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class BirdCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bird',
      usage: 'bird',
      description: 'Finds a random bird for your viewing pleasure.',
      type: client.types.FUN
    });
  }
  async run(message) {
    try {
      const res = await fetch('http://shibe.online/api/birds');
      const img = (await res.json())[0];
      const embed = new MessageEmbed()
        .setTitle('🐦  Chirp!  🐦')
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
