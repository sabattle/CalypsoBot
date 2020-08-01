const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      aliases: ['setting', 'set', 's', 'config', 'conf'],
      usage: 'settings',
      description: 'Displays all the current settings for your server.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {

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
    const messagePoints = `\`${row.message_points}\``;
    const commandPoints = `\`${row.command_points}\``;
    const voicePoints = `\`${row.voice_points}\``;
    let verificationMessage = row.verification_message || '`None`';
    let welcomeMessage = row.welcome_message || '`None`';
    let leaveMessage = row.leave_message || '`None`';
    let crownMessage = row.crown_message || '`None`';
    const crownSchedule = (row.crown_schedule) ? `\`${row.crown_schedule}\`` : '`None`';
    let disabledCommands = '`None`';
    if (row.disabled_commands) 
      disabledCommands = row.disabled_commands.split(' ').map(c => `\`${c}\``).join(' ');

    // Set statuses
    const verificationStatus = 
      (row.verification_role_id && row.verification_channel_id && row.verificaton_message) ? '`enabled`' : '`disabled`';
    const randomColorStatus = (row.random_color) ? '`enabled`' : '`disabled`';
    const autoKickStatus = (row.auto_kick) ? `After \`${row.auto_kick}\` warn(s)` : '`disabled`';
    const welcomeStatus = (row.welcome_message && row.welcome_channel_id) ? '`enabled`' : '`disabled`';
    const leaveStatus = (row.leave_message && row.leave_channel_id) ? '`enabled`' : '`disabled`';
    const pointsStatus = (row.point_tracking) ? '`enabled`' : '`disabled`';
    const crownStatus = (row.crown_role && row.crown_schedule) ? '`enabled`' : '`disabled`';
    
    // Trim messages to 512 characters
    if (verificationMessage != '`None`') 
      verificationMessage = `\`\`\`${verificationMessage.slice(0, 509) + '...'}\`\`\``;
    if (welcomeMessage != '`None`') welcomeMessage = `\`\`\`${welcomeMessage.slice(0, 509) + '...'}\`\`\``;
    if (leaveMessage != '`None`') leaveMessage = `\`\`\`${leaveMessage.slice(0, 509) + '...'}\`\`\``;
    if (crownMessage != '`None`') crownMessage = `\`\`\`${crownMessage.slice(0, 509) + '...'}\`\`\``;

    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      // System Settings
      .addField('__**System**__', stripIndent`
        **Prefix:** ${prefix}
        **System Channel:** ${systemChannel}
        **Modlog Channel:** ${modlogChannel}
        **Admin Role:** ${adminRole}
        **Mod Role:** ${modRole}
        **Mute Role:** ${muteRole}
        **Auto Role:** ${autoRole}
        **Auto Kick:** ${autoKickStatus}
        **Random Color:** ${randomColorStatus}
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
      .addField('__**Disabled Commands**__', disabledCommands)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);


    message.channel.send(embed);
  }
};