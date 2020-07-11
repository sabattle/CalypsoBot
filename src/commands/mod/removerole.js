const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class RemoveRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'removerole',
      aliases: ['remover', 'rr'],
      usage: 'removerole <user mention/ID> <role mention/ID> [reason]',
      description: 'Removes the specified role from the provided user.',
      type: types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['removerole @Nettles @Member']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) return this.sendErrorMessage(message, 'Invalid argument. Please mention a user or provide a user ID.');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, `
        Invalid argument. You cannot remove a role from someone with an equal or higher role.
      `);

    const role = this.getRoleFromMention(message, args[1]) || message.guild.roles.cache.get(args[1]);
    let reason = args.slice(2).join(' ');
    if(!reason) reason = 'No reason provided';
    if (!role) return this.sendErrorMessage(message, 'Invalid role. Please mention a role or provide a role ID.');
    else if (!member.roles.cache.has(role.id)) // If member doesn't have role
      return this.sendErrorMessage(message, `Unable to remove role. ${member} does not have the ${role} role.`);
    else {
      try {

        // Add role
        await member.roles.remove(role);
        const embed = new MessageEmbed()
          .setTitle('Remove Role')
          .setDescription(`${role} was successfully removed from ${member}.`)
          .addField('Executor', message.member, true)
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