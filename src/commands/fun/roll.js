const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class RollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roll',
      aliases: ['dice', 'r'],
      usage: 'roll <arg>',
      description: 'roll a die',
      type: client.types.FUN,
      examples: ['roll 20']
    });
  }
  run(message, args) {
    let limit = args[0];
    if (!limit) limit = 100;
    const n = Math.floor(Math.random() * limit + 1);
    if (!n || limit <= 0)
      return this.sendErrorMessage(message, 0, 'Please provide a valid number of dice sides');
    const embed = new MessageEmbed()
    message.channel.send(`**${message.member.displayName}** rolls **${n}** (1-${limit})`);
  }
};