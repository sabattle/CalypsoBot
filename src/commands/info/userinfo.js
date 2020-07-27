const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const statuses = {
  online: ' <:online:735341197450805279> Online',
  idle: '<:idle:735341387842584648> AFK',
  offline: '<:offline:735341676121554986> Offline',
  dnd: '<:dnd:735341494537289768> Do Not Disturb'
};
const flags = {
  DISCORD_EMPLOYEE: '<:DISCORD_EMPLOYEE:735339014621626378> `Discord Employee`',
  DISCORD_PARTNER: '<:DISCORD_PARTNER:735339215746760784> `Discord Partner`',
  BUGHUNTER_LEVEL_1: '<:BUGHUNTER_LEVEL_1:735339352913346591> `Bug Hunter (Level 1)`',
  BUGHUNTER_LEVEL_2: '<:BUGHUNTER_LEVEL_2:735339420667871293> `Bug Hunter (Level 2)`',
  HYPESQUAD_EVENTS: '<:HYPESQUAD_EVENTS:735339581087547392> `HypeSquad Events`',
  HOUSE_BRAVERY: '<:HOUSE_BRAVERY:735339756283756655> `House of Bravery`',
  HOUSE_BRILLIANCE: '<:HOUSE_BRILLIANCE:735339675102871642> `House of Brilliance`',
  HOUSE_BALANCE: '<:HOUSE_BALANCE:735339871018942466> `House of Balance`',
  EARLY_SUPPORTER: '<:EARLY_SUPPORTER:735340061226172589> `Early Supporter`',
  TEAM_USER: 'Team User',
  SYSTEM: 'System',
  VERIFIED_BOT: '<:VERIFIED_BOT:735345343037833267> `Verified Bot`',
  VERIFIED_DEVELOPER: '<:VERIFIED_DEVELOPER:735340154310361202> `Verified Bot Developer`'
};

module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      aliases: ['whois', 'user', 'ui'],
      usage: 'userinfo [user mention/ID]',
      description: 'Fetches a user\'s information. If no user is given, your own information will be displayed.',
      type: client.types.INFO,
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
    
    // Trim roles
    let roles = message.client.utils.trimArray(member.roles.cache.array().filter(r => !r.name.startsWith('#')));
    roles = message.client.utils.removeElement(roles, message.guild.roles.everyone)
      .sort((a, b) => b.position - a.position).join(' ');
    
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}'s Information`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addField('Username', member.user.username, true)
      .addField('Discriminator', `\`#${member.user.discriminator}\``, true)
      .addField('ID', `\`${member.id}\``, true)
      .addField('Nickname', (member.nickname) ? member.nickname : '`None`', true)
      .addField('Status', statuses[member.presence.status], true)
      .addField('Color Role', member.roles.color || '`None`', true)
      .addField('Highest Role', member.roles.highest, true)
      .addField('Joined server on', moment(member.joinedAt).format('MMM DD YYYY'), true)
      .addField('Joined Discord on', moment(member.user.createdAt).format('MMM DD YYYY'), true)
      .addField('Roles', roles)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(member.displayHexColor);
    if (activities.length > 0) embed.setDescription(activities.join('\n'));
    if (customStatus) embed.spliceFields(0, 0, { name: 'Custom Status', value: customStatus});
    if (userFlags.length > 0) embed.addField('Badges', userFlags.map(flag => flags[flag]).join('\n'));
    message.channel.send(embed);
  }
};
