const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class UnmuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unmute',
      usage: 'unmute <user mention/ID>',
      description: 'Unmutes the specified user.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['unmute @Nettles']
    });
  }
  async run(message, args) {
    const muteRoleId = message.client.db.settings.selectMuteRoleId.pluck().get(message.guild.id);
    let muteRole;
    if (muteRoleId) muteRole = message.guild.roles.cache.get(muteRoleId);
    else return this.sendErrorMessage(message, 1, 'There is currently no mute role set on this server');

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot unmute someone with an equal or higher role');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    if (!member.roles.cache.has(muteRoleId)) 
      return this.sendErrorMessage(message, 0, 'Provided member is not muted');
    
    // Unmute member
    message.client.clearTimeout(member.timeout);
    try {
      await member.roles.remove(muteRole);
      const embed = new MessageEmbed()
        .setTitle('Unmute Member')
        .setDescription(`${member} has been unmuted.`)
        .addField('Reason', reason)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      return this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
    }
    
    // Update mod log
    this.sendModLogMessage(message, reason, { Member: member });
  }
};
