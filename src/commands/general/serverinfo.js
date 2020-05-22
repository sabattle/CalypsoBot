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
const verifLevels = ['None', 'Low', 'Medium', '(╯°□°）╯︵  ┻━┻', '┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻'];

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
    const embed = new Discord.MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setThumbnail(message.guild.iconURL())
      .addField('Owner', message.guild.owner.displayName, true)
      .addField('Region', region[message.guild.region], true)
      .addField('Members', message.guild.members.cache.size, true)
      .addField('Bots', message.guild.members.cache.array().filter(b => b.user.bot).length, true)
      .addField('Verification Level', verifLevels[message.guild.verificationLevel], true)
      .addField('Created On', moment(message.guild.createdAt).format('MMM DD YYYY'), true)
      .addField('Roles', message.guild.roles.cache.array().filter(r => r.name.indexOf('#') !== 0).join(' '))
      .addField('Text Channels', message.guild.channels.cache.array().filter(c => c.type === 'text').join(' '))
      .setFooter(`Server ID: ${message.guild.id}`)
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
