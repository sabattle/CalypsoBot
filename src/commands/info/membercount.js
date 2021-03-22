  
const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class ServerCountCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'membercount',
      aliases: ['usercount'],
      usage: 'membercount',
      description: 'Get\'s current server\'s member count.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setDescription(`${message.client.guilds.cache.size}`)
      .setTimestamp()
      .setColor('BLUE');
    message.channel.send(embed);
  }
};