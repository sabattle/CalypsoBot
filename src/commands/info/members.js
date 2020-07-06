const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class MembersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'members',
      aliases: ['memberstatus'],
      usage: 'members',
      description: 'Displays how many server members are online, busy, AFK, and offline.',
      type: 'info'
    });
  }
  run(message) {
    const online = message.guild.members.cache.array().filter((m) => m.presence.status === 'online').length;
    const offline = message.guild.members.cache.array().filter((m) => m.presence.status === 'offline').length;
    const dnd = message.guild.members.cache.array().filter((m) => m.presence.status === 'dnd').length;
    const afk = message.guild.members.cache.array().filter((m) => m.presence.status === 'idle').length;
    const embed = new MessageEmbed()
      .setTitle(`Member Status [${message.guild.members.cache.size}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`
        🟢 **Online**: \`${online}\` members

        🔴 **Busy**: \`${dnd}\` members

        🟠 **AFK**: \`${afk}\` members

        ⚫ **Offline**: \`${offline}\` members
      `)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};