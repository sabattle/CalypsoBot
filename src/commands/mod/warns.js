const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class WarnsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warns',
      aliases: ['warnings'],
      usage: 'warns <user mention/ID>',
      description: 'Displays a member\'s current warnings. A max of 5 warnings can be displayed.',
      type: client.types.MOD,
      examples: ['warns @Nettles']
    });
  }
  run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) return this.sendErrorMessage(message, 'Invalid argument. Please mention a user or provide a user ID.'); 

    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}'s Warns`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    let warns = message.client.db.users.selectWarns.pluck().get(member.id, message.guild.id) || { warns: [] };
    if (typeof(warns) == 'string') warns = JSON.parse(warns);

    const count = warns.warns.length;
    let max = (count > 5) ? 5 : count;
    if (count == 0) embed.setDescription(`${member} currently has no warns.`);
    else embed.setDescription(`Showing ${member}'s last \`${max}\` of \`${warns.warns.length}\` warns.`);
    for (let i = 1; i <= max; i++) {
      embed // Build warning list
        .addField(`\`Warn #${i}\``, warns.warns[count - i].reason)
        .addField('Moderator', message.guild.members.cache.get(warns.warns[count - i].mod) || '`Unable to find moderator`', true)
        .addField('Date Issued', warns.warns[count - i].date, true);
    }

    message.channel.send(embed);
  }
};
