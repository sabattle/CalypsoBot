const Command = require('../Command.js');
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
    // Check permissions
    const permission = this.checkPermissions(message);
    if (permission !== true) return message.channel.send(permission);
    const row = message.client.db.guildSettings.selectRow.get(message.guild.id);
    const defaultChannel = message.guild.channels.get(row.default_channel_id) || '';
    const adminRole = message.guild.roles.get(row.admin_role_id) || '';
    const modRole = message.guild.roles.get(row.mod_role_id) || '';
    const autoRole = message.guild.roles.get(row.auto_role_id) || '';
    let useWelcomeMessage = 'false';
    if (row.use_welcome_message) useWelcomeMessage = 'true';
    let useLeaveMessage = 'false';
    if (row.use_leave_message) useLeaveMessage = 'true'; 
    message.channel.send(stripIndent`
      **Prefix**: \`${row.prefix}\`
      **Default Channel**: ${defaultChannel}
      **Admin Role**: ${adminRole}
      **Mod Role**: ${modRole}
      **Auto Role**: ${autoRole}
      **Use Welcome Message**: \`${useWelcomeMessage}\`
      **Use Leave Message**: \`${useLeaveMessage}\`
    `);
  }
};