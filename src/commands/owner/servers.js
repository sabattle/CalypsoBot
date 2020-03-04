const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class ServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servers',
      aliases: ['servs'],
      usage: '',
      description: 'Displays a list of Calypso\'s joined servers.',
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message) {
    let serverList = '';
    message.client.guilds.forEach(guild => {
      serverList = serverList + `${guild.name} | \`${guild.members.array().length}\` members\n`;
    });
    const embed = new Discord.RichEmbed()
      .setTitle('Server List')
      .setDescription(serverList)
      .setColor(message.guild.me.displayHexColor)
      .setFooter(`Found ${message.client.guilds.array().length} servers`);
    message.channel.send(embed);
  }
};
