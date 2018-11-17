const Discord = require('discord.js');
module.exports = {
  name: 'admins',
  usage: '',
  description: 'Displays a list of all current administrators.',
  tag: 'general',
  run: async (message) => {
    let row;
    try {
      row = message.client.getRow.get(message.guild.id);
      if (row.adminRole === 'none') return message.channel.send('There is currently no administrator role on this server.');
    }
    catch (err) {
      return message.channel.send('Sorry, I don\'t know the name of this server\'s administrator role. Has a server administrator ran ``!setup``?');
    }
    const admins = message.guild.members.filter(m => {
      if (m.roles.find(r => r.name === row.adminRole)) return true;
    });
    let adminList = '';
    admins.forEach(m => adminList = adminList + `${m.displayName}\n`);
    const embed = new Discord.RichEmbed()
      .setAuthor('Admin List', message.guild.iconURL)
      .setDescription(adminList)
      .setFooter(`${admins.size} out of ${message.guild.members.size} accounts`)
      .setColor((await message.guild.fetchMember(message.client.user)).displayHexColor);
    message.channel.send(embed);
  }
};
