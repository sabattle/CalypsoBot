const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class FindIdCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'findid',
      aliases: ['find', 'id'],
      usage: 'findid <user/role/channel mention>',
      description: 'Finds the ID of the mentioned user, role, or text channel.',
      type: client.types.INFO,
      examples: ['findid @Nettles', 'findid #general']
    });
  }
  run(message, args) {
    const target = this.getMemberFromMention(message, args[0]) || 
      this.getRoleFromMention(message, args[0]) || 
      this.getChannelFromMention(message, args[0]);
    if (!target) 
      return this.sendErrorMessage(message, 0, 'Please mention a user, role, or text channel');
    const id = target.id;
    const embed = new MessageEmbed()
      .setTitle('Find ID')
      .addField('Target', target, true)
      .addField('ID', `\`${id}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
