const Discord = require('discord.js');

module.exports = {
  name: 'admins',
  usage: '',
  description: 'Displays a list of all current admins.',
  tag: 'general',
  run: (message) => {
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
