const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const statuses = {
  online: 'Online',
  idle: 'AFK',
  offline: 'Offline',
  dnd: 'Do Not Disturb'
};
const flags = {
  DISCORD_EMPLOYEE: 'Discord Employee',
  DISCORD_PARTNER: 'Discord Partner',
  BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
  BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
  HYPESQUAD_EVENTS: 'HypeSquad Events',
  HOUSE_BRAVERY: 'House of Bravery',
  HOUSE_BRILLIANCE: 'House of Brilliance',
  HOUSE_BALANCE: 'House of Balance',
  EARLY_SUPPORTER: 'Early Supporter',
  TEAM_USER: 'Team User',
  SYSTEM: 'System',
  VERIFIED_BOT: 'Verified Bot',
  VERIFIED_DEVELOPER: 'Verified Bot Developer'
};

module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      aliases: ['user', 'ui'],
      usage: 'userinfo [user mention/ID]',
      description: 'Fetches a user\'s information. If no user is given, your own information will be displayed.',
      type: types.INFO,
      examples: ['userinfo @Calypso']
    });
  }
  async run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const userFlags = (await member.user.fetchFlags()).toArray();
    const activities = [];
    let customStatus;
    for (const activity of member.presence.activities.values()) {
      switch (activity.type) {
        case 'PLAYING':
          activities.push(`Playing **${activity.name}**`);
          break;
        case 'LISTENING':
          if (member.user.bot) activities.push(`Listening to **${activity.name}**`);
          else activities.push(`Listening to **${activity.details}** by **${activity.state}**`);
          break;
        case 'WATCHING':
          activities.push(`Watching **${activity.name}**`);
          break;
        case 'STREAMING':
          activities.push(`Streaming **${activity.name}**`);
          break;
        case 'CUSTOM_STATUS':
          customStatus = activity.state;
          break;
      }
    }
    
    const embed = new MessageEmbed()
      .setTitle(member.displayName)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addField('ID', `\`${member.id}\``, true)
      .addField('Username', member.user.username, true)
      .addField('Discriminator', `\`#${member.user.discriminator}\``, true)
      .addField('Status', statuses[member.presence.status], true)
      .addField('Color', member.roles.color || 'None', true)
      .addField('Highest Role', member.roles.highest, true)
      .addField('Joined server on', moment(member.joinedAt).format('MMM DD YYYY'), true)
      .addField('Joined Discord on', moment(member.user.createdAt).format('MMM DD YYYY'), true)
      .addField('Roles', member.roles.cache.array().filter(r => r.name.indexOf('#') !== 0).join(' '))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(member.displayHexColor);
    if (activities.length > 0) embed.setDescription(activities.join('\n'));
    if (customStatus) embed.spliceFields(0, 0, { name: 'Custom Status', value: customStatus});
    if (userFlags.length > 0) embed.addField('Flags', userFlags.map(flag => `\`${flags[flag]}\``).join('\n'));
    message.channel.send(embed);
  }
};
