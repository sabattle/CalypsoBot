const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetCrownMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownmessage',
      aliases: ['setcrownmsg', 'setcm', 'scm'],
      usage: 'setcrownmessage <message>',
      description: oneLine`
        Sets the message Calypso will say during the crown role rotation.
        You may use \`?member\` to substitute for a user mention ,
        \`?username\` to substitute for someone's username,
        \`?tag\` to substitute for someone's full Discord tag (username + discriminator),
        \`?role\` to substitute for the \`crown role\`,
        and \`?points\` to substitute for the current points of the winner.
        Enter no message to clear the current \`crown message\`.
        A \`crown message\` will only be sent if a \`crown channel\`, \`crown role\`, and \`crown schedule\` are set.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownmessage ?member has won the ?role!']
    });
  }
  run(message, args) {
    const { 
      crown_role_id: crownRoleId, 
      crown_channel_id: crownChannelId, 
      crown_schedule: crownSchedule 
    } = message.client.db.settings.selectCrown.get(message.guild.id);
    const crownRole = message.guild.roles.cache.get(crownRoleId);
    const crownChannel = message.guild.channels.cache.get(crownChannelId);

    // Get status
    const status = message.client.utils.getStatus(crownRoleId, crownSchedule);

    const embed = new MessageEmbed()
      .setTitle('Settings: `Crown`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`crown message\` was successfully updated. ${success}`)
      .addField('Role', crownRole || '`None`', true)
      .addField('Channel', crownChannel || '`None`', true)
      .addField('Schedule', `\`${(crownSchedule) ? crownSchedule : 'None'}\``, true)
      .addField('Status', `\`${status}\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear message
    if (!args[0]) {
      message.client.db.settings.updateCrownMessage.run(null, message.guild.id);
      return message.channel.send(embed.addField('Message', '`None`')
      );
    }

    let crownMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateCrownMessage.run(crownMessage, message.guild.id);
    if (crownMessage.length > 1024) crownMessage = crownMessage.slice(0, 1021) + '...';
    message.channel.send(embed.addField('Message', message.client.utils.replaceCrownKeywords(crownMessage))
    );
  }
};