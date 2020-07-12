const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      aliases: ['config', 'set', 's'],
      usage: 'settings',
      description: 'Displays all the current settings for your server.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    const row = message.client.db.settings.selectRow.get(message.guild.id);
    const defaultChannel = message.guild.channels.cache.get(row.default_channel_id) || '';
    const welcomeChannel = message.guild.channels.cache.get(row.welcome_channel_id) || '';
    const leaveChannel = message.guild.channels.cache.get(row.leave_channel_id) || '';
    const crownChannel = message.guild.channels.cache.get(row.crown_channel_id) || '';
    const modlogChannel = message.guild.channels.cache.get(row.modlog_channel_id) || '';
    const adminRole = message.guild.roles.cache.get(row.admin_role_id) || '';
    const modRole = message.guild.roles.cache.get(row.mod_role_id) || '';
    const muteRole = message.guild.roles.cache.get(row.mute_role_id) || '';
    const autoRole = message.guild.roles.cache.get(row.auto_role_id) || '';
    const crownRole = message.guild.roles.cache.get(row.crown_role_id) || '';
    let welcomeMessage = 'disabled';
    if (row.welcome_message) welcomeMessage = 'enabled';
    let leaveMessage = 'disabled';
    if (row.leave_message) leaveMessage = 'enabled';
    let crownMessage = 'disabled';
    if (row.crown_message) crownMessage = 'enabled';
    let crownSchedule = '';
    if (row.crown_schedule) crownSchedule = `\`${row.crown_schedule}\``;
    let disabledCommands = '';
    if (row.disabled_commands) disabledCommands = row.disabled_commands.split(' ').map(c => `\`${c}\``).join(' ');
    const settings = stripIndent`
        **Prefix:** \`${row.prefix}\`
        **Default Channel:** ${defaultChannel}
        **Welcome Channel:** ${welcomeChannel}
        **Leave Channel:** ${leaveChannel}
        **Crown Channel:** ${crownChannel}
        **Modlog Channel:** ${modlogChannel}
        **Admin Role:** ${adminRole}
        **Mod Role:** ${modRole}
        **Mute Role:** ${muteRole}
        **Auto Role:** ${autoRole}
        **Crown Role:** ${crownRole}
        **Message Points:** \`${row.message_points}\`
        **Command Points:** \`${row.command_points}\`
        **Voice Points:** \`${row.voice_points}\`
        **Welcome Message:** \`${welcomeMessage}\`
        **Leave Message:** \`${leaveMessage}\`
        **Crown Message:** \`${crownMessage}\`
        **Crown Schedule:** ${crownSchedule}
        **Disabled Commands**: ${disabledCommands}
    `;
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(settings)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};