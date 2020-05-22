const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class ShowPermissionsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'showpermissions',
      aliases: ['showp', 'shp'],
      usage: '<USER MENTION>',
      description: 'Displays all available permissions (or your own, if no user is mentioned).',
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.member;
    const permissions = member.permissions.toArray().map(p => '`' + p + '`').join('\n');
    const embed = new Discord.MessageEmbed()
      .setTitle(`${member.displayName}'s Permissions`)
      .setDescription(permissions)
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};