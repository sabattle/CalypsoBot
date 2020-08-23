const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class FoxCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'fox',
      usage: 'fox',
      description: 'Finds a random fox for your viewing pleasure.',
      type: client.types.FUN
    });
  }
  async run(message) {
    try {
      const res = await fetch('https://randomfox.ca/floof/');
      const img = (await res.json()).image;
      const embed = new MessageEmbed()
        .setTitle('🦊  What does the fox say?  🦊')
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
