const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownmessage',
      aliases: ['setcm', 'scm'],
      usage: '',
      description: oneLine`
        Sets the message Calypso will say during the crown role rotation.
        You may use \`?member\` to substitute for a user mention and \`?role\` to substitute for the crown role.
        Enter no message to clear the current crown message.
        `,
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownmessage ?member has won the ?role!']
    });
  }
  run(message) {
    const oldCrownMessage = message.client.db.guildSettings.selectCrownMessage.pluck().get(message.guild.id);
    const status = (oldCrownMessage) ? '`true`' : '`false`';
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .addField('Setting', '**Crown Message**', true)
      .setThumbnail(message.guild.iconURL())
      .setFooter(`
        Requested by ${message.member.displayName}#${message.author.discriminator}`, message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (!message.content.includes(' ')) {
      message.client.db.guildSettings.updateCrownMessage.run(null, message.guild.id);
      return message.channel.send(embed
        .addField('Current Status', `${status} 🡪 \`false\``, true)
        .addField('New Message', '`None`')
      );
    }
    let crownMessage = message.content.slice(message.content.indexOf(' '), message.content.length);
    message.client.db.guildSettings.updateCrownMessage.run(crownMessage, message.guild.id);
    if (crownMessage.length > 1024) crownMessage = crownMessage.slice(1021) + '...';
    message.channel.send(embed
      .addField('Current Status', `${status} 🡪 \`true\``, true)
      .addField('New Message', crownMessage)
    );
    
  }
};