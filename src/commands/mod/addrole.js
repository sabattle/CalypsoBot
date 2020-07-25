const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AddRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addrole',
      aliases: ['addr', 'ar'],
      usage: 'addrole <user mention/ID> <role mention/ID> [reason]',
      description: 'Adds the specified role to the provided user.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['addrole @Nettles @Member']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) return this.sendErrorMessage(message, 'Invalid argument. Please mention a user or provide a user ID.');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, `
        Invalid argument. You cannot add a role to someone with an equal or higher role.
      `);

    const role = this.getRoleFromMention(message, args[1]) || message.guild.roles.cache.get(args[1]);
    
    let reason = args.slice(2).join(' ');
    if (!reason) reason = 'No reason provided';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (!role) return this.sendErrorMessage(message, 'Invalid role. Please mention a role or provide a role ID.');
    else if (member.roles.cache.has(role.id)) // If member already has role
      return this.sendErrorMessage(message, `Unable to add role. ${member} already has the ${role} role.`);
    else {
      try {

        // Add role
        await member.roles.add(role);
        const embed = new MessageEmbed()
          .setTitle('Add Role')
          .setDescription(`${role} was successfully added to ${member}.`)
          .addField('Moderator', message.member, true)
          .addField('Member', member, true)
          .addField('Role', role, true)
          .addField('Reason', reason)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);

        // Update modlog
        this.sendModlogMessage(message, reason, { Member: member, Role: role });

      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 'Something went wrong. Please check the role hierarchy.', err.message);
      }
    }  
  }
};