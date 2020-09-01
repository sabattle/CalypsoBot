const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ClearWarnsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearwarns',
      usage: 'clearwarns <user mention/ID> [reason]',
      description: 'Clears all the warns of the provided member.',
      type: client.types.MOD,
      userPermissions: ['KICK_MEMBERS'],
      examples: ['clearwarns @Nettles']
    });
  }
  run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'You cannot clear your own warns'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot clear the warns of someone with an equal or higher role');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    message.client.db.users.updateWarns.run('', member.id, message.guild.id);

    const embed = new MessageEmbed()
      .setTitle('Clear Warns')
      .setDescription(`${member}'s warns have been successfully cleared.`)
      .addField('Moderator', message.member, true)
      .addField('Member', member, true)
      .addField('Warn Count', '`0`', true)
      .addField('Reason', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(oneLine`
      ${message.guild.name}: ${message.author.tag} cleared ${member.user.tag}'s warns
    `);
    
    // Update mod log
    this.sendModLogMessage(message, reason, { Member: member, 'Warn Count': '`0`' });
  }
};
