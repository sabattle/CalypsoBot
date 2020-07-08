const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'h'],
      usage: 'help [command]',
      description: oneLine`
        Displays a list of all current commands, sorted by category. 
        Can be used in conjunction with a command for additional information.
      `,
      type: types.INFO,
      examples: ['help ping']
    });
  }
  run(message, args) {

    // Get disabled commands
    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    let embed;
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    if (args.length > 0 && (message.client.commands.has(args[0]) || message.client.aliases.has(args[0]))) {
      const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
      let description = `${command.description} 
        ${(command.aliases) ? '\n‣ **Aliases:** ' + command.aliases.map(c => `\`${c}\``).join(' ') : ''}
        ‣ **Usage:** \`${prefix}${command.usage}\`
        ‣ **Type:** \`${command.type}\`
        ${(command.examples) ? '‣ **Examples:** ' + command.examples.map(c => `\`${prefix}${c}\``).join(' ') : ''}
      `;

      embed = new MessageEmbed()
        .setTitle(`Command: \`${command.name}\``)
        .setThumbnail('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso.png')
        .setDescription(description)  
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

    } else if (args.length > 0) {
      return this.sendErrorMessage(message, `Unable to find command \`${args[0]}\`. Please enter a valid command.`);

    } else {
      const info = [], fun = [], point = [], color = [], mod = [],  admin = [];
      message.client.commands.forEach(c => {
        if (c.type === 'info' && !disabledCommands.includes(c.name)) info.push(`\`${c.name}\``);
        else if (c.type === 'fun' && !disabledCommands.includes(c.name)) fun.push(`\`${c.name}\``);
        else if (c.type === 'point' && !disabledCommands.includes(c.name)) point.push(`\`${c.name}\``);
        else if (c.type === 'mod' && !disabledCommands.includes(c.name)) mod.push(`\`${c.name}\``);
        else if (c.type === 'color' && !disabledCommands.includes(c.name)) color.push(`\`${c.name}\``);
        else if (c.type === 'admin' && !disabledCommands.includes(c.name)) admin.push(`\`${c.name}\``);
      });

      embed = new MessageEmbed()
        .setTitle('Calypso\'s Commands')
        .setDescription(stripIndent`
          ‣ The prefix on **${message.guild.name}** is \`${prefix}\`
          ‣ Use \`${prefix}help [command]\` for more information
        `)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setImage('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso_Title.png')
        .setColor(message.guild.me.displayHexColor);
      if (info.length > 0) embed.addField(`**Info [${info.length}]**`, info.join(' '));
      if (fun.length > 0) embed.addField(`**Fun [${fun.length}]**`, fun.join(' '));
      if (point.length > 0)  embed.addField(`**Point [${point.length}]**`, point.join(' '));
      if (color.length > 0)  embed.addField(`**Color [${color.length}]**`, color.join(' '));
      if (mod.length > 0) embed.addField(`**Mod [${mod.length}]**`, mod.join(' '));
      embed.addField(`**Admin [${admin.length}]**`, admin.join(' '));
      embed.addField(
        '**Links**', 
        '**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=416451977380364288&scope=bot&permissions=268528727) | ' +
        '[Support Server](https://discord.gg/pnYVdut) | ' +
        '[Repository](https://github.com/sabattle/CalypsoBot)**'
      );
        
    }
    message.channel.send(embed);
  }
};
