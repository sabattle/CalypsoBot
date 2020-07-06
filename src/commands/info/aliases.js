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

    // Get disabled commands
    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    let infoAliases = '';
    let funAliases = '';
    let pointAliases = '';
    let colorAliases = '';
    let modAliases = '';
    let adminAliases = '';
    message.client.commands.forEach(command => {
      if (command.aliases) {
        if (command.type == 'info' && !disabledCommands.includes(command.name)) 
          infoAliases = infoAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'fun' && !disabledCommands.includes(command.name))
          funAliases = funAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'point' && !disabledCommands.includes(command.name))
          pointAliases = pointAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'color' && !disabledCommands.includes(command.name))
          colorAliases = colorAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'mod' && !disabledCommands.includes(command.name))
          modAliases = modAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
        if (command.type == 'admin' && !disabledCommands.includes(command.name))
          adminAliases = adminAliases + `**${command.name}**: \`${command.aliases.join(', ')}\`\n`;
      } 
    });

    const embed = new MessageEmbed()
      .setTitle('Alias List')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    const info = infoAliases.split('\n');
    const fun = funAliases.split('\n');
    const point = pointAliases.split('\n');
    const color = colorAliases.split('\n');
    const mod = modAliases.split('\n');
    const admin = adminAliases.split('\n');

    if (info[0]) embed.addField(`**Info [${info.length - 1}]**`, infoAliases);
    if (fun[0]) embed.addField(`**Fun [${fun.length - 1}]**`, funAliases);
    if (point[0]) embed.addField(`**Point [${point.length - 1}]**`, pointAliases);
    if (color[0]) embed.addField(`**Color [${color.length - 1}]**`, colorAliases);
    if (mod[0]) embed.addField(`**Mod [${mod.length - 1}]**`, modAliases);
    embed.addField(`**Admin [${admin.length - 1}]**`, adminAliases);
      
    message.channel.send(embed);
  }
};
