const Command = require('../Command.js');
const Discord = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class PointBreakdownCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pointbreakdown',
      aliases: ['pbd'],
      usage: '',
      description: 'Displays the amount of points earned per action.',
      type: types.POINTS
    });
  }
  run(message) {
    const messagePoints = message.client.db.settings.selectMessagePoints.pluck().get(message.guild.id);
    const commandPoints = message.client.db.settings.selectCommandPoints.pluck().get(message.guild.id);
    const voicePoints = message.client.db.settings.selectVoicePoints.pluck().get(message.guild.id);
    const breakdown = stripIndent`
      **Message Points**: \`${messagePoints} per message\`
      **Command Points**: \`${commandPoints} per command\`
      **Voice Points**: \`${voicePoints} per minute\`
    `;
    const embed = new Discord.MessageEmbed()
      .setTitle(`${message.guild.name}'s Point Breakdown`)
      .setColor(message.guild.me.displayHexColor)
      .setDescription(breakdown);
    message.channel.send(embed);
  }
};