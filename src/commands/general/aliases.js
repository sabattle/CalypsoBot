const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AliasesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'aliases',
      aliases: ['alias', 'ali'],
      usage: 'aliases',
      description: 'Displays a list of all current aliases per command.',
      type: 'general'
    });
  }
  run(message) {
    let generalAliases = '';
    let funAliases = '';
    let pointAliases = '';
    let howtoAliases = '';
    let modAliases = '';
    let adminAliases = '';
    message.client.commands.forEach(command => {
      if (command.aliases) {
        if (command.type == 'general')
          generalAliases = generalAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'fun')
          funAliases = funAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'point')
          pointAliases = pointAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'howto')
          howtoAliases = howtoAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'mod')
          modAliases = modAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'admin')
          adminAliases = adminAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
      } 
    });
    const embed = new MessageEmbed()
      .setTitle('Alias List')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField(`**General [${generalAliases.split('\n').length - 1}]**`, generalAliases)
      .addField(`**Fun [${funAliases.split('\n').length - 1}]**`, funAliases)
      .addField(`**Point [${pointAliases.split('\n').length - 1}]**`, pointAliases)
      .addField(`**How To [${howtoAliases.split('\n').length - 1}]**`, howtoAliases)
      .addField(`**Mod [${modAliases.split('\n').length - 1}]**`, modAliases)
      .addField(`**Admin [${adminAliases.split('\n').length - 1}]**`, adminAliases)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
