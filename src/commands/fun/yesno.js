const Command = require('../Command.js');
const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = class YesNoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'yesno',
      aliases: ['yn'],
      usage: '',
      description: 'Fetches a gif of a yes or a no.',
      type: 'fun'
    });
  }
  async run(message) {
    try {
      const res = await (await fetch('http://yesno.wtf/api/')).json();
      const answer = res.answer.charAt(0).toUpperCase() + res.answer.slice(1) + '!';
      const img = res.image;
      const embed = new Discord.MessageEmbed()
        .setTitle(answer)
        .setImage(img)
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
