const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');

module.exports = class StatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'invites',
      usage: 'stats',
      description: 'Fetches Calypso\'s statistics.',
      type: client.types.INFO
    });
  }
  async run(message, args) {
    try {
        let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

        let invites = await message.guild.fetchInvites()

        let memberInvites = invites.filter(i => i.inviter && i.inviter.id === member.user.id);

        if (memberInvites.size <= 0) {
            return message.channel.send(`**${member.displayName} didn't invite anyone to the server!**`, (member === message.member ? null : member));
{}          }

        let content = memberInvites.map(i => i.code).join("\n");
        let index = 0;
        memberInvites.forEach(invite => index += invite.uses);

        let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setFooter(message.guild.name, message.guild.iconURL())
            .setThumbnail(message.author.avatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name}`)
            .setDescription(`${member.displayName}'s Invite stats`)
            .addField("Invites", index, false)
            .addField("Invite", content, false);
        message.channel.send(embed);
    } catch (e) {
        return message.channel.send(e.message)
    }
}
};