const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AdminsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'admins',
      usage: 'admins',
      description: 'Displays a list of all current admins.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle('Admin List [0]')
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    
    // Get admin role
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    let adminRole;
    if (adminRoleId) adminRole = message.guild.roles.cache.get(adminRoleId);
    else return message.channel.send(embed.setDescription('Sorry! The `admin role` is not set on this server.'));

    const admins = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === adminRole)) return true;
    }).array();

    let description = message.client.utils.trimStringFromArray(admins);
    if (admins.length === 0) description = 'Sorry! No admins found.';

    embed.setTitle(`Admin List [${admins.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField('Admin Role', adminRole)
      .addField('Admin Count', `**${admins.length}** out of **${message.guild.members.cache.size}** accounts`);
    message.channel.send(embed);
  }
};