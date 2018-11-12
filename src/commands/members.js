const Discord = require('discord.js');

module.exports = {
  name: 'members',
  usage: '',
  description: 'Displays a list of all current members.',
  tag: 'general',
  run: (message) => {
    let row;
    try {
      row = message.client.fetchRow.get(message.guild.id);
    }
    catch (err) {
      return message.channel.send('Sorry, I don\'t know the name of your member role. Have you ran ``!setup``?');
    }
    if (row.member === 'none') return message.channel.send('There is currently no member role on this server.');
    let members = message.guild.members.filter(m => {
      if (m.roles.find('name', row.member)) return true;
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
