const Discord = require('discord.js');

module.exports = {
  name: 'mods',
  usage: '',
  description: 'Displays a list of all current moderators.',
  tag: 'general',
  run: async (message) => {
    let config;
    try {
      config = message.client.getConfig.get(message.guild.id);
      if (config.modRole === 'none') return message.channel.send('There is currently no moderator role on this server.');
    }
    catch (err) {
      return message.channel.send(`Sorry ${message.member}, I don't know the name of this server's moderator role. Has a server administrator ran \`\`!setup\`\`?`);
    }
    const mods = message.guild.members.filter(m => {
      if (m.roles.find(r => r.name === config.modRole)) return true;
    });
    let modList = '';
    mods.forEach(m => modList = modList + `${m.displayName}\n`);
    const embed = new Discord.RichEmbed()
      .setAuthor('Mod List', message.guild.iconURL)
      .setDescription(modList)
      .setFooter(`${mods.size} out of ${message.guild.members.size} accounts`)
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
