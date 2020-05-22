const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class AliasesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'aliases',
      aliases: ['alias', 'ali', 'a'],
      usage: '',
      description: 'Displays a list of all current aliases per command.',
      type: 'general'
    });
  }
  run(message) {
    let aliases = '';
    message.client.commands.forEach(command => {
      if (command.aliases && command.type != 'owner') 
        aliases = aliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
    });
    const embed = new Discord.MessageEmbed()
      .setTitle('Alias List')
      .setColor(message.guild.me.displayHexColor)
      .setDescription(aliases);
    message.channel.send(embed);
  }
};
