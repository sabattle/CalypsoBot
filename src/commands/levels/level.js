const Command = require('../Command.js');
const db = require('quick.db');

module.exports = class GendCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'level',
      usage: 'level',
      description: 'displays your rank in a small embed',
      type: client.types.LEVELS
    });
  }
  async run (message, args) {
    try {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
        if (!user) return message.channel.send('**Please Enter A Valid User!**')
        if (user.user.bot) return message.channel.send(`**Bot's Dont Have XP Level!**`);

        let guildMessages = db.fetch(`guildMessages_${message.guild.id}`)
        if (guildMessages === null) return message.channel.send(`**Level Up Messages Are Currently Disabled!\n\`${prefix}setxp\` To Enable**`);

        let xp = db.fetch(`messages_${message.guild.id}_${user.id}`)
        let lvl = db.fetch(`level_${message.guild.id}_${user.id}`)

        if (lvl === null) lvl = 0
        if (xp === null) xp = 0

        let curxp = xp;
        let curlvl = lvl;
        let nxtLvlXp = curlvl * 100;
        let difference2 = nxtLvlXp + 100 - curxp;

        const embed = new MessageEmbed()
            .setTitle(`**${user.displayName}'s Level Information**`)
            .setColor("GREEN")
            .setDescription(`**Current Level - \`${curlvl}\` | Total XP - \`${curxp - 1}\`
                Needed XP To Reach Next Level - \`${difference2 + 1}\`**
                `)
            .setFooter(message.guild.name, message.guild.iconURL())
        message.channel.send(embed)

    } catch {
        message.channel.send(`**Oh No! An Error Occurred!**`);
    }
}
};