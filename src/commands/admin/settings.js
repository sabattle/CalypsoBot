const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent, oneLine } = require('common-tags');

module.exports = class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      aliases: ['set', 's', 'config', 'conf'],
      usage: 'settings [category]',
      description: oneLine`
        Displays all the current settings for your server. 
        If a category is provided, only settings belonging to it will be displayed.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['settings System']
    });
  }
  run(message, args) {

    const { replaceKeywords, replaceCrownKeywords } = message.client.utils;

    // Set values
    const row = message.client.db.settings.selectRow.get(message.guild.id);
    const prefix = `\`${row.prefix}\``;
    const systemChannel = message.guild.channels.cache.get(row.system_channel_id) || '`None`';
    const modlogChannel = message.guild.channels.cache.get(row.modlog_channel_id) || '`None`';
    const verificationChannel = message.guild.channels.cache.get(row.verification_channel_id) || '`None`';
    const welcomeChannel = message.guild.channels.cache.get(row.welcome_channel_id) || '`None`';
    const leaveChannel = message.guild.channels.cache.get(row.leave_channel_id) || '`None`';
    const crownChannel = message.guild.channels.cache.get(row.crown_channel_id) || '`None`';
    const adminRole = message.guild.roles.cache.get(row.admin_role_id) || '`None`';
    const modRole = message.guild.roles.cache.get(row.mod_role_id) || '`None`';
    const muteRole = message.guild.roles.cache.get(row.mute_role_id) || '`None`';
    const autoRole = message.guild.roles.cache.get(row.auto_role_id) || '`None`';
    const verificationRole = message.guild.roles.cache.get(row.verification_role_id) || '`None`';
    const crownRole = message.guild.roles.cache.get(row.crown_role_id) || '`None`';
    const autoKick = (row.auto_kick) ? `After \`${row.auto_kick}\` warn(s)` : '`disabled`';
    const messagePoints = `\`${row.message_points}\``;
    const commandPoints = `\`${row.command_points}\``;
    const voicePoints = `\`${row.voice_points}\``;
    let verificationMessage = (row.verification_message) ? replaceKeywords(row.verification_message) : '`None`';
    let welcomeMessage = (row.welcome_message) ? replaceKeywords(row.welcome_message) : '`None`';
    let leaveMessage = (row.leave_message) ? replaceKeywords(row.leave_message ) : '`None`';
    let crownMessage = (row.crown_message) ? replaceCrownKeywords(row.crown_message) : '`None`';
    const crownSchedule = (row.crown_schedule) ? `\`${row.crown_schedule}\`` : '`None`';
    let disabledCommands = '`None`';
    if (row.disabled_commands) 
      disabledCommands = row.disabled_commands.split(' ').map(c => `\`${c}\``).join(' ');

    // Get statuses
    const verificationStatus = `\`${message.client.utils.getStatus(
      row.verification_role_id && row.verification_channel_id && row.verification_message
    )}\``;
    const randomColor = `\`${message.client.utils.getStatus(row.random_color)}\``;
    const welcomeStatus = `\`${message.client.utils.getStatus(row.welcome_message && row.welcome_channel_id)}\``;
    const leaveStatus = `\`${message.client.utils.getStatus(row.leave_message && row.leave_channel_id)}\``;
    const pointsStatus = `\`${message.client.utils.getStatus(row.point_tracking)}\``;
    const crownStatus = `\`${message.client.utils.getStatus(row.crown_role_id && row.crown_schedule)}\``;

    /** ------------------------------------------------------------------------------------------------
     * CATEGORY CHECKS
     * ------------------------------------------------------------------------------------------------ */
    let setting = args.join('').toLowerCase();
    if (setting.endsWith('setting')) setting = setting.slice(0, -7);
    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    switch (setting) {
      case 'sys':
      case 'system':
        return message.channel.send(embed
          .setTitle('Settings: `System`')
          .addField('Prefix', prefix, true)
          .addField('System Channel', systemChannel, true)
          .addField('Modlog Channel', modlogChannel, true)
          .addField('Admin Role', adminRole, true)
          .addField('Mod Role', modRole, true)
          .addField('Mute Role', muteRole, true)
          .addField('Auto Role', autoRole, true)
          .addField('Auto Kick', autoKick, true)
          .addField('Random Color', randomColor, true)
        );
      case 'verif':
      case 'verification':
        embed
          .setTitle('Settings: `Verification`')
          .addField('Role', verificationRole, true)
          .addField('Channel', verificationChannel, true)
          .addField('Status', verificationStatus, true);
        if (verificationMessage.length > 1024) embed
          .setDescription(verificationMessage)
          .addField('Message', 'Message located above due to character limits.');
        else embed.addField('Message', verificationMessage);
        return message.channel.send(embed);
      case 'welcome':
      case 'welcomemessage':
      case 'welcomemessages':
        embed
          .setTitle('Settings: `Welcome Messages`')
          .addField('Channel', welcomeChannel, true)
          .addField('Status', welcomeStatus, true);
        if (welcomeMessage.length > 1024) embed
          .setDescription(welcomeMessage)
          .addField('Message', 'Message located above due to character limits.');
        else embed.addField('Message', welcomeMessage);
        return message.channel.send(embed);
      case 'leave':
      case 'leavemessage':
      case 'leavemessages':
        embed
          .setTitle('Settings: `Leave Messages`')
          .addField('Channel', leaveChannel, true)
          .addField('Status', leaveStatus, true);
        if (leaveMessage.length > 1024) embed
          .setDescription(leaveMessage)
          .addField('Message', 'Message located above due to character limits.');
        else embed.addField('Message', leaveMessage);
        return message.channel.send(embed);
      case 'points':
      case 'pointssys':
      case 'pointssystem':
        return message.channel.send(embed
          .setTitle('Settings: `Points System`')
          .addField('Message Points', messagePoints, true)
          .addField('Command Points', commandPoints, true)
          .addField('Voice Points', voicePoints, true)
          .addField('Status', pointsStatus)
        );
      case 'crown':
      case 'crownsys':
      case 'crownsystem':
        embed
          .setTitle('Settings: `Crown System`')
          .addField('Role', crownRole, true)
          .addField('Channel', crownChannel, true)
          .addField('Schedule', crownSchedule, true)
          .addField('Status', crownStatus);
        if (crownMessage.length > 1024) embed
          .setDescription(crownMessage)
          .addField('Message', 'Message located above due to character limits.');
        else embed.addField('Message', crownMessage);
        return message.channel.send(embed);
      case 'commands':
      case 'disabled':
      case 'disabledcommands':
        return message.channel.send(embed
          .setTitle('Settings: `Disabled Commands`')
          .addField('Disabled Commands', disabledCommands)
        );
    }
    if (setting)
      return this.sendErrorMessage(message, 0, stripIndent`
        Please enter a valid settings category, use ${row.prefix}settings for a list
      `);

    /** ------------------------------------------------------------------------------------------------
     * FULL SETTINGS
     * ------------------------------------------------------------------------------------------------ */

    // Trim messages to 512 characters
    if (verificationMessage.length > 512) verificationMessage = verificationMessage.slice(0, 509) + '...';
    if (welcomeMessage.length > 512) welcomeMessage = welcomeMessage.slice(0, 509) + '...';
    if (leaveMessage.length > 512) leaveMessage = leaveMessage.slice(0, 509) + '...';
    if (crownMessage.length > 512) crownMessage = crownMessage.slice(0, 509) + '...';

    embed
      .setTitle('Settings')
      .setDescription(`**Specific Category:** \`${row.prefix}settings [category]\``)
      // System Settings
      .addField('__**System**__', stripIndent`
        **Prefix:** ${prefix}
        **System Channel:** ${systemChannel}
        **Modlog Channel:** ${modlogChannel}
        **Admin Role:** ${adminRole}
        **Mod Role:** ${modRole}
        **Mute Role:** ${muteRole}
        **Auto Role:** ${autoRole}
        **Auto Kick:** ${autoKick}
        **Random Color:** ${randomColor}
      `)
      // Verification Settings
      .addField('__**Verification**__', stripIndent`
        **Status:** ${verificationStatus}
        **Role:** ${verificationRole}
        **Channel:** ${verificationChannel}
        **Message:** ${verificationMessage}
      `)
      // Welcome Settings
      .addField('__**Welcome Messages**__', stripIndent`
        **Status:** ${welcomeStatus}
        **Channel:** ${welcomeChannel}
        **Message:** ${welcomeMessage}
      `)
      // Leave Settings
      .addField('__**Leave Messages**__', stripIndent`
        **Status:** ${leaveStatus}
        **Channel:** ${leaveChannel}
        **Message:** ${leaveMessage}
      `)
      // Point Settings
      .addField('__**Points System**__', stripIndent`
        **Status:** ${pointsStatus}
        **Message Points:** ${messagePoints}
        **Command Points:** ${commandPoints}
        **Voice Points:** ${voicePoints}
      `)
      // Crown Settings
      .addField('__**Crown System**__', stripIndent`
        **Status:** ${crownStatus}
        **Schedule:** ${crownSchedule}
        **Role:** ${crownRole}
        **Channel:** ${crownChannel}
        **Message:** ${crownMessage}
      `)
      // Disabled Commands
      .addField('__**Disabled Commands**__', disabledCommands);

    message.channel.send(embed);
  }
};