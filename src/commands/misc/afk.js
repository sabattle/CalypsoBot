const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const db = require('quick.db')

module.exports = class AfkCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'afk',
      usage: 'afk <reason>',
      description: 'Set status as afk',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['afk coding']
    });
  }
  async run(message, args) {
    const content = args.join(" ")
    await db.set(`afk-${message.author.id}+${message.guild.id}`, content)
    const embed = new MessageEmbed()
      .setDescription(`You have been set to afk\n**Reason :** ${content}`)
      .setColor("GREEN")
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic : true }))
    message.channel.send(embed);   
  }
};