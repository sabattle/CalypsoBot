const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');

module.exports = class WarnsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warns',
      aliases: ['warnings'],
      usage: 'warns <user mention/ID>',
      description: 'Displays a member\'s current warnings. A max of 5 warnings can be displayed at one time.',
      type: client.types.MOD,
      userPermissions: ['KICK_MEMBERS'],
      examples: ['warns @Nettles']
    });
  }
  run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');

    let warns = message.client.db.users.selectWarns.pluck().get(member.id, message.guild.id) || { warns: [] };
    if (typeof(warns) == 'string') warns = JSON.parse(warns);
    const count = warns.warns.length;

    const embed = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    
    const buildEmbed = (current, embed) => {
      const max = (count > current + 5) ? current + 5 : count;
      let amount = 0;
      for (let i = current; i < max; i++) {
        embed // Build warning list
          .addField('\u200b', `**Warn \`#${i + 1}\`**`)
          .addField('Reason', warns.warns[i].reason)
          .addField(
            'Moderator', 
            message.guild.members.cache.get(warns.warns[i].mod) || '`Unable to find moderator`',
            true
          )
          .addField('Date Issued', warns.warns[i].date, true);
        amount += 1;
      }

      return embed
        .setTitle('Warn List ' + this.client.utils.getRange(warns.warns, current, 5))
        .setDescription(`Showing \`${amount}\` of ${member}'s \`${count}\` total warns.`);
    };

    if (count == 0) message.channel.send(embed
      .setTitle('Warn List [0]')
      .setDescription(`${member} currently has no warns.`)
    );
    else if (count < 5) message.channel.send(buildEmbed(0, embed));
    else {

      let n = 0;
      const json = embed.setFooter(
        'Expires after three minutes.\n' + message.member.displayName, 
        message.author.displayAvatarURL({ dynamic: true })
      ).toJSON();
      
      const first = () => {
        if (n === 0) return;
        n = 0;
        return buildEmbed(n, new MessageEmbed(json));
      };

      const previous = () => {
        if (n === 0) return;
        n -= 5;
        if (n < 0) n = 0;
        return buildEmbed(n, new MessageEmbed(json));
      };

      const next = () => {
        const cap = count - (count % 5);
        if (n === cap || n + 5 === count) return;
        n += 5;
        if (n >= count) n = cap;
        return buildEmbed(n, new MessageEmbed(json));
      };

      const last = () => {
        const cap = count - (count % 5);
        if (n === cap || n + 5 === count) return;
        n = cap;
        if (n === count) n -= 5;
        return buildEmbed(n, new MessageEmbed(json));
      };

      const reactions = {
        '⏪': first,
        '◀️': previous,
        '▶️': next,
        '⏩': last,
        '⏹️': null,
      };

      const menu = new ReactionMenu(
        message.client,
        message.channel, 
        message.member, 
        buildEmbed(n, new MessageEmbed(json)), 
        null,
        null,
        reactions, 
        180000
      );

      menu.reactions['⏹️'] = menu.stop.bind(menu);

    }
  }
};
