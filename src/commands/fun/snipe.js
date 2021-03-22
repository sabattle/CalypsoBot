const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SnipeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'snipe',
      aliases: ['spe'],
      usage: 'snipe',
      description: 'Snipes a message!',
      type: client.types.FUN,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }
  run(message, args){
const snipes = message.client.snipes.get(message.channel.id) || [];
    const msg = snipes[args[0] - 1 || 0];
    if (!msg) return message.channel.send(`There is nothing to snipe lol!`);
    const Embed = new MessageEmbed()
    .setAuthor(`${message.member.displayName} just sniped`)
      .setDescription(msg.content)
      .setFooter(`Sniped by ${message.author.id}`)
      .setColor('RANDOM')
      .setTimestamp()
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }));
    if (msg.attachment) Embed.setImage(msg.attachment);
    message.channel.send(Embed);
      }
}