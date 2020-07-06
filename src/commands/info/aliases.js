const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AliasesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'aliases',
      aliases: ['alias', 'ali'],
      usage: 'aliases',
      description: 'Displays a list of all current aliases per command.',
      type: 'info'
    });
  }
  run(message) {
    let infoAliases = '';
    let funAliases = '';
    let pointAliases = '';
    let colorAliases = '';
    let modAliases = '';
    let adminAliases = '';
    message.client.commands.forEach(command => {
      if (command.aliases) {
        if (command.type == 'info')
        infoAliases = infoAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'fun')
          funAliases = funAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'point')
          pointAliases = pointAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'color')
        colorAliases = colorAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'mod')
          modAliases = modAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'admin')
          adminAliases = adminAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
      } 
    });
    const embed = new MessageEmbed()
      .setTitle('Alias List')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField(`**Info [${infoAliases.split('\n').length - 1}]**`, infoAliases)
      .addField(`**Fun [${funAliases.split('\n').length - 1}]**`, funAliases)
      .addField(`**Point [${pointAliases.split('\n').length - 1}]**`, pointAliases)
      .addField(`**Color [${colorAliases.split('\n').length - 1}]**`, colorAliases)
      .addField(`**Mod [${modAliases.split('\n').length - 1}]**`, modAliases)
      .addField(`**Admin [${adminAliases.split('\n').length - 1}]**`, adminAliases)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
