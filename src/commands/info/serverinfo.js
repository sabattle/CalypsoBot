const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const region = {
  'us-central': 'US Central :flag_us:',
  'us-east': 'US East :flag_us:',
  'us-south': 'US South :flag_us:',
  'us-west': 'US West :flag_us:',
  'europe': 'Europe :flag_eu:',
  'singapore': 'Singapore :flag_sg:',
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
      type: client.types.INFO
    });
  }
  run(message) {

    // Trim roles
    let roles = message.client.utils.trimArray(
      message.guild.roles.cache.array().filter(r => !r.name.startsWith('#'))
    );
    roles = message.client.utils.removeElement(roles, message.guild.roles.everyone);
    roles.sort((a, b) => b.position - a.position);

    // Trim text channels
    const textChannels = message.client.utils.trimArray(
      message.guild.channels.cache.array().filter(c => c.type === 'text').sort((a, b) => a.rawPosition - b.rawPosition)
    );
    
    // Trim voice channels
    const voiceChannels = message.client.utils.trimArray(
      message.guild.channels.cache.array().filter(c => c.type === 'voice')
    );
    
    const embed = new MessageEmbed()
      .setTitle(`${message.guild.name}'s Information`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('ID', `\`${message.guild.id}\``, true)
      .addField('Owner <:owner:735338114230255616>', message.guild.owner, true)
      .addField('Region', region[message.guild.region], true)
      .addField('Members', `\`${message.guild.memberCount}\``, true)
      .addField('Bots', `\`${message.guild.members.cache.array().filter(b => b.user.bot).length}\``, true)
      .addField('Role Count', `\`${message.guild.roles.cache.size - 1}\``, true) // Don't count @everyone
      .addField('Text Channel Count', `\`${textChannels.length}\``, true)
      .addField('Voice Channel Count', `\`${voiceChannels.length}\``, true)
      .addField('Verification Level', verificationLevels[message.guild.verificationLevel], true)
      .addField('AFK Channel', 
        (message.guild.afkChannel) ? `<:voice:735665114870710413> ${message.guild.afkChannel.name}` : '`None`', true
      )
      .addField('AFK Timeout', 
        (message.guild.afkChannel) ? 
          `\`${moment.duration(message.guild.afkTimeout * 1000).asMinutes()} minutes\`` : '`None`', 
        true
      )
      .addField('Created On', moment(message.guild.createdAt).format('MMM DD YYYY'), true)
      .addField('Roles', roles.join(' '))
      .addField('Text Channels', textChannels.join(' ') || '`None`')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (message.guild.description) embed.setDescription(message.guild.description);
    if (message.guild.bannerURL) embed.setImage(message.guild.bannerURL({ dynamic: true }));
    message.channel.send(embed);
  }
};
