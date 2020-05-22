const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class MembersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'members',
      usage: '',
      description: 'Displays how many server members are online, busy, AFK, and offline.',
      type: 'general'
    });
  }
  run(message) {

    const online = message.guild.members.cache.array().filter((m) => m.presence.status === 'online').length;
    const offline = message.guild.members.cache.array().filter((m) => m.presence.status === 'offline').length;
    const dnd = message.guild.members.cache.array().filter((m) => m.presence.status === 'dnd').length;
    const afk = message.guild.members.cache.array().filter((m) => m.presence.status === 'idle').length;
    const embed = new Discord.MessageEmbed()
      .setTitle('Member Status')
      .setDescription(`
        🟢 **Online**: \`${online}\` members

        🔴 **Busy**: \`${dnd}\` members

        🟠 **AFK**: \`${afk}\` members

        ⚫ **Offline**: \`${offline}\` members
      `)
      .setColor(message.guild.me.displayHexColor)
      .setFooter(`Found ${message.guild.members.cache.array().length} members`);
    message.channel.send(embed);
  }
};