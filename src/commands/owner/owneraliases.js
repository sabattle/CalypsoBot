const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class OwnerAliasesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'owneraliases',
      aliases: ['ownerali', 'oali', 'oa'],
      usage: 'owneraliases',
      description: 'Displays a list of all current aliases per owner command.',
      type: types.OWNER,
      ownerOnly: true
    });
  }
  run(message) {
    
    const aliases = [];

    message.client.commands.forEach(command => {
      if (command.aliases && command.type == types.OWNER) 
        aliases.push(`**${command.name}**: ${command.aliases.map(a => `\`${a}\``).join(' ')}`);
    });

    const embed = new MessageEmbed()
      .setTitle(`Owner Alias List [${aliases.length}]`)
      .setThumbnail('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso.png')
      .setDescription(aliases.join('\n'))
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
