const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AdminsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'admins',
      usage: 'admins',
      description: 'Displays a list of all current admins.',
      type: 'general'
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle('Admin List [0]')
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    const adminRoleId = message.client.db.guildSettings.selectAdminRoleId.pluck().get(message.guild.id);
    let adminRole;
    if (adminRoleId) adminRole = message.guild.roles.cache.get(adminRoleId);
    else return message.channel.send(embed.setDescription('Sorry! The `admin role` has not been set on this server.'));
    const admins = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === adminRole)) return true;
    });
    let adminList = '';
    admins.forEach(m => adminList = adminList + `${m.displayName}#${m.user.discriminator}\n`);
    embed.setTitle(`Admin List [${admins.size}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Admin Role', adminRole)
      .addField('Admin Count', `**${admins.size}** out of **${message.guild.members.cache.size}** accounts`);
    while (adminList.length > 2048) { // Description is capped at 2048 chars
      adminList = adminList.substring(0, adminList.lastIndexOf('\n') -2);
      const count = adminList.split('\n').length;
      embed.spliceFields(0, 1, { name: 'Admin Count', value: `
        **${admins.size}** out of **${message.guild.members.cache.size}** accounts
        Only **${count}** of **${admins.size}** admins can be shown
      `});
    }
    embed.setDescription(adminList);
    message.channel.send(embed);
  }
};