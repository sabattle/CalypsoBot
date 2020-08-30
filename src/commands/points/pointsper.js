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
    const { message_points: messagePoints, command_points: commandPoints, voice_points: voicePoints } 
      = message.client.db.settings.selectPoints.get(message.guild.id);
    const pointsPer = stripIndent`
      Message Points :: ${messagePoints} per message
      Command Points :: ${commandPoints} per command
      Voice Points   :: ${voicePoints} per minute
    `;

    const embed = new MessageEmbed()
      .setTitle('Points Per Action')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`\`\`\`asciidoc\n${pointsPer}\`\`\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};