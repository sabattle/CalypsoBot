const Discord = require('discord.js');
module.exports = {
  name: 'admins',
  usage: '',
  description: 'Displays a list of all current administrators.',
  tag: 'general',
  run: async (message) => {
    let config;
    try {
      config = message.client.getConfig.get(message.guild.id);
      if (config.adminRole === 'none') return message.channel.send('There is currently no administrator role on this server.');
    }
    catch (err) {
      return message.channel.send(`Sorry ${message.member}, I don't know the name of this server's administrator role. Has a server administrator ran \`\`!setup\`\`?`);
    }
    const admins = message.guild.members.filter(m => {
      if (m.roles.find(r => r.name === config.adminRole)) return true;
    });
    let adminList = '';
    admins.forEach(m => adminList = adminList + `${m.displayName}\n`);
    const embed = new Discord.RichEmbed()
      .setAuthor('Admin List', message.guild.iconURL)
      .setDescription(adminList)
      .setFooter(`${admins.size} out of ${message.guild.members.size} accounts`)
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
