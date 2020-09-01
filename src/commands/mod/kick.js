const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      usage: 'kick <user mention/ID> [reason]',
      description: 'Kicks a member from your server.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      examples: ['kick @Nettles']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'You cannot kick yourself'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot kick someone with an equal or higher role');
    if (!member.kickable) 
      return this.sendErrorMessage(message, 0, 'Provided member is not kickable');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await member.kick(reason);

    const embed = new MessageEmbed()
      .setTitle('Kick Member')
      .setDescription(`${member} was successfully kicked.`)
      .addField('Moderator', message.member, true)
      .addField('Member', member, true)
      .addField('Reason', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} kicked ${member.user.tag}`);
    
    // Update mod log
    this.sendModLogMessage(message, reason, { Member: member});
  }
};
