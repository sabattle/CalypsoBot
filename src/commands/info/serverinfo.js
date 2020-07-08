const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const region = {
  'us-central': 'US Central :flag_us:',
  'us-east': 'US East :flag_us:',
  'us-south': 'US South :flag_us:',
  'us-west': 'US West :flag_us:',
  'eu-west': 'EU West :flag_eu:',
  'eu-central': 'EU Central :flag_eu:',
  'singapore': 'Singapore :flag_sg:',
  'london': 'London :flag_gb:',
  'japan': 'Japan :flag_jp:',
  'russia': 'Russia :flag_ru:',
  'hongkong': 'Hong Kong :flag_hk:',
  'brazil': 'Brazil :flag_br:',
  'sydney': 'Sydney :flag_au:',
  'southafrica': 'South Africa :flag_za:'
};
const verificationLevels = {
  NONE: 'None',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  VERY_HIGH: 'Highest'
};

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      aliases: ['server', 'si'],
      usage: 'serverinfo',
      description: 'Fetches information and statistics about the server.',
      type: 'info'
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle(message.guild.name)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Server ID', `\`${message.guild.id}\``)
      .addField('Owner', message.guild.owner, true)
      .addField('Region', region[message.guild.region], true)
      .addField('Members', message.guild.memberCount, true)
      .addField('Bots', message.guild.members.cache.array().filter(b => b.user.bot).length, true)
      .addField('Verification Level', verificationLevels[message.guild.verificationLevel], true)
      .addField('Created On', moment(message.guild.createdAt).format('MMM DD YYYY'), true)
      .addField('Roles', message.guild.roles.cache.array().filter(r => r.name.indexOf('#') !== 0).join(' '))
      .addField('Text Channels', message.guild.channels.cache.array().filter(c => c.type === 'text').join(' '))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (message.guild.description) embed.setDescription(message.guild.description);
    if (message.guild.bannerURL) embed.setImage(message.guild.bannerURL({ dynamic: true }));
    message.channel.send(embed);
  }
};
