const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class CurrentPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'currentpoints',
      aliases: ['currpoints', 'cp'],
      usage: 'currentpoints <user mention/ID>',
      description: 'Fetches a user\'s current points. If no user is given, your own points will be displayed.',
      type: types.POINTS,
      examples: ['currentpoints @Nettles']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const points = message.client.db.users.selectPoints.pluck().get(member.id, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Current Points')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Member', message.member, true)
      .addField('Points', `\`${points}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
