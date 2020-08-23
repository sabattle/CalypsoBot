const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class DogFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dogfact',
      aliases: ['df'],
      usage: 'dogfact',
      description: 'Says a random dog fact.',
      type: client.types.FUN
    });
  }
  async run(message) {
    try {
      const res = await fetch('https://dog-api.kinduff.com/api/facts');
      const fact = (await res.json()).facts[0];
      const embed = new MessageEmbed()
        .setTitle('🐶  Dog Fact  🐶')
        .setDescription(fact)
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
