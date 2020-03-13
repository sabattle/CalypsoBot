const Command = require('../Command.js');
const Discord = require('discord.js');
const pkg = require(__basedir + '/package.json');
const moment = require('moment');
const { oneLine } = require('common-tags');

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      aliases: ['bot', 'bi'],
      usage: '',
      description: 'Fetches Calypso\'s information and statistics.',
      type: 'general'
    });
  }
  run(message) {
    const embed = new Discord.RichEmbed()
      .setAuthor('Calypso\'s Information', message.client.user.avatarURL)
      .setDescription(oneLine`
        Calypso is a multipurpose Discord bot with a variety of commands. Originally started as a side project, she
        soon turned into something much more. She first went live on February 22nd, 2018.
      `)
      .addField('Current Version', pkg.version, true)
      .addField('Detected Users', message.client.users.size - 1, true)
      .addField('Servers', message.client.guilds.size, true)
      .addField('Uptime', `${moment.duration(message.client.uptime).hours()} hours`, true)
      .addField('Library/Environment', 'Discord.js 11.5.1 | Node.js 8.10.0', true)
      .addField('Database', 'SQLite', true)
      .setFooter('Have Suggestions? DM Nettles#8880 or Mitchelson#0129!')
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
