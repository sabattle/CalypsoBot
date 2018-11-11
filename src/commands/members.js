const Discord = require('discord.js');

module.exports = {
  name: 'members',
  usage: '',
  description: 'Displays a list of all current members (Atlas only).',
  tag: 'general',
  run: (message) => {
    if (message.guild.name != 'Atlas') return message.channel.send('This command can only be used on the **Atlas** Discord server.');
    let members = message.guild.members.filter(m => {
      if (m.roles.find('name', 'Member')) return true;
    });
    let memberList = '';
    members.forEach(m => memberList = memberList + `${m.displayName}\n`);
    let embed = new Discord.RichEmbed()
      .setAuthor('Member List', message.guild.iconURL)
      .setDescription(memberList)
      .setFooter(`${members.size} out of ${message.guild.members.size} accounts`)
      .setColor(message.client.color);
    message.channel.send(embed);
  }
};
