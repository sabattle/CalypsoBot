const Discord = require('discord.js');
const pkg = require(__basedir + '/package.json');
const moment = require('moment');

module.exports = {
  name: 'bot',
  usage: '',
  description: 'Fetches Calypso\'s information and statistics.',
  tag: 'general',
  run: (message) => {
    let embed = new Discord.RichEmbed()
      .setAuthor('Calypso\'s Information', message.client.user.avatarURL)
      .setDescription('Calypso is a multi-purpose Discord bot coded by Nettles and designed by Nettles and Mitchelson. She first went live on February 22nd, 2018. In greek mythology, Calypso is said to be the daughter of Atlas.')
      .addField('Current Version', pkg.version, true)
      .addField('Detected Users', message.client.users.size - 1, true)
      .addField('Uptime', `${moment.duration(message.client.uptime).hours()} hours`, true)
      .addField('Library/Environment', 'Discord.js 11.3.2 | Node.js 8.9.4', true)
      .setFooter('Have Suggestions? DM Nettles#8880 or Mitchelson#0129!')
      .setTimestamp()
      .setColor(message.client.color);
    message.channel.send(embed);
  }
};
