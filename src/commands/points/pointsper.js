const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class PointPerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pointsper',
      aliases: ['pointsp', 'pp'],
      usage: '',
      description: 'Displays the amount of points earned per action.',
      type: client.types.POINTS
    });
  }
  run(message) {
    
    // Get points values
    const messagePoints = message.client.db.settings.selectMessagePoints.pluck().get(message.guild.id);
    const commandPoints = message.client.db.settings.selectCommandPoints.pluck().get(message.guild.id);
    const voicePoints = message.client.db.settings.selectVoicePoints.pluck().get(message.guild.id);
    const description = stripIndent`
      **Message Points**: \`${messagePoints} per message\`
      **Command Points**: \`${commandPoints} per command\`
      **Voice Points**: \`${voicePoints} per minute\`
    `;

    const embed = new MessageEmbed()
      .setTitle('Points Per Action')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};