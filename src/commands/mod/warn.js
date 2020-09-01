const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      usage: 'warn <user mention/ID> [reason]',
      description: 'Warns a member in your server.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      examples: ['warn @Nettles']
    });
  }
  run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'You cannot warn yourself'); 
    if (member.roles.highest.position >= message.member.roles.highest.position) 
      return this.sendErrorMessage(message, 0, 'You cannot warn someone with an equal or higher role');

    const autoKick = message.client.db.settings.selectAutoKick.pluck().get(message.guild.id); // Get warn # for auto kick

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    let warns = message.client.db.users.selectWarns.pluck().get(member.id, message.guild.id) || { warns: [] };
    if (typeof(warns) == 'string') warns = JSON.parse(warns);
    const warning = {
      mod: message.member.id,
      date:  moment().format('MMM DD YYYY'),
      reason: reason
    };

    warns.warns.push(warning);
    
    message.client.db.users.updateWarns.run(JSON.stringify(warns), member.id, message.guild.id);

    const embed = new MessageEmbed()
      .setTitle('Warn Member')
      .setDescription(`${member} has been warned.`)
      .addField('Moderator', message.member, true)
      .addField('Member', member, true)
      .addField('Warn Count', `\`${warns.warns.length}\``, true)
      .addField('Reason', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} warned ${member.user.tag}`);
    
    // Update mod log
    this.sendModLogMessage(message, reason, { Member: member, 'Warn Count': `\`${warns.warns.length}\`` });

    // Check for auto kick
    if (autoKick && warns.warns.length === autoKick) {
      message.client.commands.get('kick')
        .run(message, [member.id, `Warn limit reached. Automatically kicked by ${message.guild.me}.`]);
    }
  }
};
