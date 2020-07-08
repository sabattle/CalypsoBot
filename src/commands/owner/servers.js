const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class ServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servers',
      aliases: ['servs'],
      usage: '',
      description: 'Displays a list of Calypso\'s joined servers.',
      type: types.OWNER,
      ownerOnly: true
    });
  }
  run(message) {
    let serverList = '';
    message.client.guilds.cache.forEach(guild => {
      serverList = serverList + `${guild.name} | \`${guild.members.cache.array().length}\` members\n`;
    });
    const embed = new Discord.MessageEmbed()
      .setTitle('Server List')
      .setDescription(serverList)
      .setColor(message.guild.me.displayHexColor)
      .setFooter(`Found ${message.client.guilds.cache.array().length} servers`);
    message.channel.send(embed);
  }
};
