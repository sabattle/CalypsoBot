const Command = require('../Command.js');
const Discord = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      usage: '',
      description: 'Displays all the current settings for your server.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    const row = message.client.db.guildSettings.selectRow.get(message.guild.id);
    const defaultChannel = message.guild.channels.get(row.default_channel_id) || '';
    const adminRole = message.guild.roles.get(row.admin_role_id) || '';
    const modRole = message.guild.roles.get(row.mod_role_id) || '';
    const muteRole = message.guild.roles.get(row.mute_role_id) || '';
    const autoRole = message.guild.roles.get(row.auto_role_id) || '';
    const crownRole = message.guild.roles.get(row.crown_role_id) || '';
    let usePoints = 'false';
    if (row.use_points) usePoints = 'true';
    let useVoicePoints = 'false';
    if (row.use_voice_points) useVoicePoints = 'true';
    let useCrown = 'false';
    if (row.use_crown) useCrown = 'true';
    let useWelcomeMessage = 'false';
    if (row.use_welcome_message) useWelcomeMessage = 'true';
    let useLeaveMessage = 'false';
    if (row.use_leave_message) useLeaveMessage = 'true';
    let useCrownMessage = 'false';
    if (row.use_crown_message) useCrownMessage = 'true';
    let crownSchedule = '';
    if (row.crown_schedule) crownSchedule = `\`${row.crown_schedule}\``;
    const settings = stripIndent`
      **Prefix**: \`${row.prefix}\`
      **Default Channel**: ${defaultChannel}
      **Admin Role**: ${adminRole}
      **Mod Role**: ${modRole}
      **Mute Role**: ${muteRole}
      **Auto Role**: ${autoRole}
      **Crown Role**: ${crownRole}
      **Use Points**: \`${usePoints}\`
      **Use Voice Points**: \`${useVoicePoints}\`
      **Use Crown**: \`${useCrown}\`
      **Use Welcome Message**: \`${useWelcomeMessage}\`
      **Use Leave Message**: \`${useLeaveMessage}\`
      **Use Crown Message**: \`${useCrownMessage}\`
      **Crown Schedule**: ${crownSchedule}
    `;
    const embed = new Discord.RichEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL)
      .setColor(message.guild.me.displayHexColor)
      .setDescription(settings);
    message.channel.send(embed);
  }
};