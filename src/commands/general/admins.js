const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class AdminsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'admins',
      usage: '',
      description: 'Displays a list of all current admins.',
      type: 'general'
    });
  }
  run(message) {
    const id = message.client.db.guildSettings.selectAdminRoleId.pluck().get(message.guild.id);
    let adminRole;
    if (id) adminRole = message.guild.roles.get(id);
    else return message.channel.send('There is currently no admin role on this server.');
    const admins = message.guild.members.filter(m => {
      if (m.roles.find(r => r === adminRole)) return true;
    });
    let adminList = '';
    admins.forEach(m => adminList = adminList + `${m.displayName}\n`);
    const embed = new Discord.RichEmbed()
      .setTitle('Admin List')
      .setDescription(adminList)
      .setFooter(`${admins.size} out of ${message.guild.members.size} accounts`)
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};