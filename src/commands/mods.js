const Discord = require('discord.js');

module.exports = {
  name: 'mods',
  usage: '',
  description: 'Displays a list of all current moderators.',
  tag: 'general',
  run: (message) => {
    let row;
    try {
      row = message.client.fetchRow.get(message.guild.id);
    }
    catch (err) {
      return message.channel.send('Sorry, I don\'t know the name of your mod role. Have you ran ``!setup``?');
    }
    if (row.mod === 'none') return message.channel.send('There is currently no moderator role on this server.');
    let mods = message.guild.members.filter(m => {
      if (m.roles.find('name', row.mod)) return true;
    });
    let modList = '';
    mods.forEach(a => modList = modList + `${a.displayName}\n`);
    let embed = new Discord.RichEmbed()
      .setAuthor('Mod List', message.guild.iconURL)
      .setDescription(modList)
      .setFooter(`${mods.size} out of ${message.guild.members.size} accounts`)
      .setColor(message.client.color);
    message.channel.send(embed);
  }
};
