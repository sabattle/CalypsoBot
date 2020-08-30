const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { owner, voice } = require('../../utils/emojis.json');
const { stripIndent } = require('common-tags');
const region = {
  'us-central': ':flag_us:  `US Central`',
  'us-east': ':flag_us:  `US East`',
  'us-south': ':flag_us:  `US South`',
  'us-west': ':flag_us:  `US West`',
  'europe': ':flag_eu:  `Europe`',
  'singapore': ':flag_sg:  `Singapore`',
  'japan': ':flag_jp:  `Japan`',
  'russia': ':flag_ru:  `Russia`',
  'hongkong': ':flag_hk:  `Hong Kong`',
  'brazil': ':flag_br:  `Brazil`',
  'sydney': ':flag_au:  `Sydney`',
  'southafrica': '`South Africa` :flag_za:'
};
const verificationLevels = {
  NONE: '`None`',
  LOW: '`Low`',
  MEDIUM: '`Medium`',
  HIGH: '`High`',
  VERY_HIGH: '`Highest`'
};
const notifications = {
  ALL: '`All`',
  MENTIONS: '`Mentions`'
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

    // Get roles count
    const roleCount = message.guild.roles.cache.size - 1; // Don't count @everyone
    
    // Get member stats
    const members = message.guild.members.cache.array();
    const memberCount = members.length;
    const online = members.filter((m) => m.presence.status === 'online').length;
    const offline =  members.filter((m) => m.presence.status === 'offline').length;
    const dnd =  members.filter((m) => m.presence.status === 'dnd').length;
    const afk =  members.filter((m) => m.presence.status === 'idle').length;
    const bots = members.filter(b => b.user.bot).length;
    
    // Get channel stats
    const channels = message.guild.channels.cache.array();
    const channelCount = channels.length;
    const textChannels = 
      channels.filter(c => c.type === 'text' && c.viewable).sort((a, b) => a.rawPosition - b.rawPosition);
    const voiceChannels = channels.filter(c => c.type === 'voice').length;
    const newsChannels = channels.filter(c => c.type === 'news').length;
    const categoryChannels = channels.filter(c => c.type === 'category').length;
    
    const serverStats = stripIndent`
      Members  :: [ ${memberCount} ]
               :: ${online} Online
               :: ${dnd} Busy
               :: ${afk} AFK
               :: ${offline} Offline
               :: ${bots} Bots
      Channels :: [ ${channelCount} ]
               :: ${textChannels.length} Text
               :: ${voiceChannels} Voice
               :: ${newsChannels} Announcement
               :: ${categoryChannels} Category
      Roles    :: [ ${roleCount} ]
    `;

    const embed = new MessageEmbed()
      .setTitle(`${message.guild.name}'s Information`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('ID', `\`${message.guild.id}\``, true)
      .addField('Region', region[message.guild.region], true)
      .addField(`Owner ${owner}`, message.guild.owner, true)
      .addField('Verification Level', verificationLevels[message.guild.verificationLevel], true)
      .addField('Rules Channel', 
        (message.guild.rulesChannel) ? `${message.guild.rulesChannel}` : '`None`', true
      )
      .addField('System Channel', 
        (message.guild.systemChannel) ? `${message.guild.systemChannel}` : '`None`', true
      )
      .addField('AFK Channel', 
        (message.guild.afkChannel) ? `${voice} ${message.guild.afkChannel.name}` : '`None`', true
      )
      .addField('AFK Timeout', 
        (message.guild.afkChannel) ? 
          `\`${moment.duration(message.guild.afkTimeout * 1000).asMinutes()} minutes\`` : '`None`', 
        true
      )
      .addField('Default Notifications', notifications[message.guild.defaultMessageNotifications], true)
      .addField('Partnered', `\`${message.guild.partnered}\``, true)
      .addField('Verified', `\`${message.guild.verified}\``, true)
      .addField('Created On', `\`${moment(message.guild.createdAt).format('MMM DD YYYY')}\``, true)
      .addField('Server Stats', `\`\`\`asciidoc\n${serverStats}\`\`\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (message.guild.description) embed.setDescription(message.guild.description);
    if (message.guild.bannerURL) embed.setImage(message.guild.bannerURL({ dynamic: true }));
    message.channel.send(embed);
  }
};
