const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class OwnerAliasesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'owneraliases',
      aliases: ['ownali', 'oa'],
      usage: '',
      description: 'Displays a list of all current aliases per owner command.',
      type: types.OWNER,
      ownerOnly: true
    });
  }
  run(message) {
    let aliases = '';
    message.client.commands.forEach(command => {
      if (command.aliases && command.type == 'owner') 
        aliases = aliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
    });
    const embed = new Discord.MessageEmbed()
      .setTitle('Alias List')
      .setColor(message.guild.me.displayHexColor)
      .setDescription(aliases);
    message.channel.send(embed);
  }
};
