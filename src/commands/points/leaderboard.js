const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class LeaderboardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      aliases: ['top', 'lb', 'rankings'],
      usage: 'leaderboard [member count]',
      description: oneLine`
        Displays the server points leaderboard of the provided member count. 
        If no member count is given, the leaderboard will default to size 10.
        The max leaderboard size is 25, and minimum size is 5.
      `,
      type: client.types.POINTS,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
      examples: ['leaderboard 20']
    });
  }
  async run(message, args) {
    let max = parseInt(args[0]);
    if (!max || max < 0) max = 10;
    else if (max < 5) max = 5;
    else if (max > 25) max = 25;
    let leaderboard = message.client.db.users.selectLeaderboard.all(message.guild.id);
    const position = leaderboard.map(row => row.user_id).indexOf(message.author.id);

    const members = [];
    let count = 1;
    for (const row of leaderboard) {
      members.push(oneLine`
        **${count}.** ${await message.guild.members.cache.get(row.user_id)} - \`${row.points}\` points
      `);
      count++;
    }

    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(
        `${message.member.displayName}'s position: ${position + 1}`,  
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    

    if (members.length <= max) {
      message.channel.send(embed
        .setTitle(`Points Leaderboard [1 - ${members.length}]`)
        .setDescription(members.join('\n'))
      );

    // Reaction Menu
    } else {

      let n = 0, interval = max;
      embed
        .setTitle(`Points Leaderboard [1 - ${max}]`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expires after two minutes.\n' + `${message.member.displayName}'s position: ${position + 1}`,  
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(members.slice(n, max).join('\n'));

      const json = embed.toJSON();
      
      const first = () => {
        if (n === 0) return;
        n = 0;
        max = interval;
        return new MessageEmbed(json)
          .setTitle(`Points Leaderboard [${n + 1} - ${max}]`)
          .setDescription(members.slice(n, max).join('\n'));
      };

      const previous = () => {
        if (n === 0) return;
        n -= interval;
        max -= interval;
        if (max <= n + interval) max = n + interval;
        return new MessageEmbed(json)
          .setTitle(`Points Leaderboard [${n + 1} - ${max}]`)
          .setDescription(members.slice(n, max).join('\n'));
      };

      const next = () => {
        if (max === members.length) return;
        n += interval;
        max += interval;
        if (max >= members.length) max = members.length;
        return new MessageEmbed(json)
          .setTitle(`Points Leaderboard [${n + 1} - ${max}]`)
          .setDescription(members.slice(n, max).join('\n'));
      };

      const last = () => {
        if (max === members.length) return;
        n = members.length - (members.length % interval);
        max = members.length;
        return new MessageEmbed(json)
          .setTitle(`Points Leaderboard [${n + 1} - ${max}]`)
          .setDescription(members.slice(n, max).join('\n'));
      };

      const reactions = {
        '⏪': first,
        '◀️': previous,
        '▶️': next,
        '⏩': last
      };

      new ReactionMenu(message.channel, message.member, embed, reactions);
    }
   
  }
};
