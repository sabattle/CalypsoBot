const Discord = require('discord.js');

module.exports = {
  name: 'members',
  usage: '',
  description: 'Displays a list of all current members.',
  tag: 'general',
  run: async (message) => {
    let config;
    try {
      config = message.client.getConfig.get(message.guild.id);
      if (config.memberRole === 'none') return message.channel.send('There is currently no member role on this server.');
    }
    catch (err) {
      return message.channel.send(`Sorry ${message.member}, I don't know the name of this server's member role. Has a server administrator ran \`\`!setup\`\`?`);
    }
    const members = message.guild.members.filter(m => {
      if (m.roles.find(r => r.name === config.memberRole)) return true;
    });
    let memberList = '';
    members.forEach(m => memberList = memberList + `${m.displayName}\n`);
    const embed = new Discord.RichEmbed()
      .setAuthor('Member List', message.guild.iconURL)
      .setDescription(memberList)
      .setFooter(`${members.size} out of ${message.guild.members.size} accounts`)
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
