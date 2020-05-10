const Command = require('../Command.js');
const Discord = require('discord.js');
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

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      aliases: ['server', 'si'],
      usage: '',
      description: 'Fetches information and statistics about the server.',
      type: 'general'
    });
  }
  run(message) {
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL)
      .setThumbnail(message.guild.iconURL)
      .addField('Members', message.guild.members.size, true)
      .addField('Owner', message.guild.owner.displayName, true)
      .addField('Region', region[message.guild.region], true)
      .addField('Created On', moment(message.guild.createdAt).format('MMM DD YYYY'), true)
      .addField('Roles', message.guild.roles.array().filter(r => r.name.indexOf('#') !== 0).join(' '))
      .addField('Text Channels', message.guild.channels.array().filter(c => c.type === 'text').join(' '))
      .setFooter(`Server ID: ${message.guild.id}`)
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
