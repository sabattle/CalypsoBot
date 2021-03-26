const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AddRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'memberrole',
      usage: 'addrole <user mention/ID> <role mention/ID> [reason]',
      description: 'Adds the specified role to the provided user.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['addrole @Nettles @Member']
    });
  }
  async run(message, args) {
    if (args.includes("@everyone")) return this.sendErrorMessage(message, 0, "You kidding me? everyone will be in this role");
        
    if (args.includes("@here")) return this.sendErrorMessage(message, 0, "You kidding me? everyone will be in this role");

    if (!args[0]) return this.sendErrorMessage(message, 0, "Enter a role to check")

    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

    if (!role) return this.sendErrorMessage(message, 0, "This is not a valid role");

    let membersWithRole = message.guild.members.cache.filter(member => {
        return member.roles.cache.find(r => r.name === role.name);
    }).map(member => {
        return member.user.tag;
    })
    if (membersWithRole > 2048) return message.channel.send('**List Is Too Long!**')

    let roleEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Users With The ${role.name} Role!`)
        .setDescription(membersWithRole.join("\n"));
    message.channel.send(roleEmbed);
}
}