const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class RemoveRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'removerole',
      aliases: ['remover', 'rr'],
      usage: 'removerole <user mention/ID> <role mention/ID> [reason]',
      description: 'Removes the specified role from the provided user.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['removerole @Nettles @Member']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot remove a role from someone with an equal or higher role');

    const role = this.getRoleFromMention(message, args[1]) || message.guild.roles.cache.get(args[1]);

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    if (!role) 
      return this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');
    else if (!member.roles.cache.has(role.id)) // If member doesn't have role
      return this.sendErrorMessage(message, 0, 'User does not have the provided role');
    else {
      try {

        // Add role
        await member.roles.remove(role);
        const embed = new MessageEmbed()
          .setTitle('Remove Role')
          .setDescription(`${role} was successfully removed from ${member}.`)
          .addField('Moderator', message.member, true)
          .addField('Member', member, true)
          .addField('Role', role, true)
          .addField('Reason', reason)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);

        // Update mod log
        this.sendModLogMessage(message, reason, { Member: member, Role: role });

      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
      }
    }  
  }
};