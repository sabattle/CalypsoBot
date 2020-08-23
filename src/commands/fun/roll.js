const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class RollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roll',
      aliases: ['dice', 'r'],
      usage: 'roll <dice sides>',
      description: 'Rolls a dice with the specified number of sides. Will default to 6 sides if no number is given.',
      type: client.types.FUN,
      examples: ['roll 20']
    });
  }
  run(message, args) {
    let limit = args[0];
    if (!limit) limit = 6;
    const n = Math.floor(Math.random() * limit + 1);
    if (!n || limit <= 0)
      return this.sendErrorMessage(message, 0, 'Please provide a valid number of dice sides');
    const embed = new MessageEmbed()
      .setTitle('🎲  Dice Roll  🎲')
      .setDescription(`${message.member}, you rolled a **${n}**!`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
