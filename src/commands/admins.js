const Discord = require('discord.js');

module.exports = {
  name: 'admins',
  usage: '',
  description: 'Displays a list of all current admins (Atlas only).',
  tag: 'general',
  run: (message) => {
    if (message.guild.name != 'Atlas') return message.channel.send('This command can only be used on the **Atlas** Discord server.');
    let admins = message.guild.members.filter(m => {
      if (m.roles.find('name', 'Admin')) return true;
    });
    let adminList = '';
    admins.forEach(a => adminList = adminList + `${a.displayName}\n`);
    let embed = new Discord.RichEmbed()
      .setAuthor('Admin List', message.guild.iconURL)
      .setDescription(adminList)
      .setFooter(`${admins.size} out of ${message.guild.members.size} accounts`)
      .setColor(message.client.color);
    message.channel.send(embed);
  }
};
