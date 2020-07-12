const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class PositionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'position',
      aliases: ['pos'],
      usage: 'position <user mention/ID>',
      description: oneLine`
        Fetches a user's current leaderboard position. 
        If no user is given, your own position will be displayed.
      `,
      type: client.types.POINTS,
      examples: ['position @Nettles']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const leaderboard = message.client.db.users.selectLeaderboard.all(message.guild.id);
    const pos = message.client.utils.getOrdinalNumeral(leaderboard.map(row => row.user_id).indexOf(member.id) + 1);
    const points = message.client.db.users.selectPoints.pluck().get(member.id, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Leaderboard Position')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`${member} is in **${pos}** place!`)
      .addField('Points', `\`${points}\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
