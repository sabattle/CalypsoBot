const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownmessage',
      aliases: ['setcm', 'scm'],
      usage: 'setcrownmessage <message>',
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
    const oldCrownMessage = message.client.db.settings.selectCrownMessage.pluck().get(message.guild.id);
    const status = (oldCrownMessage) ? '`enabled`' : '`disabled`';
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', 'Crown Message', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (!message.content.includes(' ')) {
      message.client.db.settings.updateCrownMessage.run(null, message.guild.id);
      return message.channel.send(embed
        .addField('Current Status', `${status} ➔ \`disabled\``, true)
        .addField('New Message', '`None`')
      );
    }
    let crownMessage = message.content.slice(message.content.indexOf(' '), message.content.length);
    message.client.db.settings.updateCrownMessage.run(crownMessage, message.guild.id);
    if (crownMessage.length > 1024) crownMessage = crownMessage.slice(1021) + '...';
    message.channel.send(embed
      .addField('Current Status', `${status} ➔ \`enabled\``, true)
      .addField('New Message', crownMessage)
    );
  }
};