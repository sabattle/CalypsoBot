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

    const embed = new MessageEmbed();
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    
    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (command && command.type != types.OWNER && !disabledCommands.includes(command.name)) {
      
      embed // Build specific command help embed
        .setTitle(`Command: \`${command.name}\``)
        .setThumbnail('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso.png')
        .setDescription(command.description)
        .addField('Usage', `\`${prefix}${command.usage}\``, true)
        .addField('Type', `\`${command.type}\``, true)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      if (command.aliases) embed.addField('Aliases', command.aliases.map(c => `\`${c}\``).join(' '));
      if (command.examples) embed.addField('Examples', command.examples.map(c => `\`${prefix}${c}\``).join('\n'));

    } else if (args.length > 0) {
      return this.sendErrorMessage(message, `Unable to find command \`${args[0]}\`. Please enter a valid command.`);

    } else {

      // Get commands
      const commands = {};
      for (const type of Object.values(types)) {
        commands[type] = [];
      }
  
      message.client.commands.forEach(command => {
        if (!disabledCommands.includes(command.name)) commands[command.type].push(`\`${command.name}\``);
      });

      embed // Build help embed
        .setTitle('Calypso\'s Commands')
        .setDescription(stripIndent`
          The prefix on **${message.guild.name}** is \`${prefix}\`
          Use \`${prefix}help [command]\` for more information
        `)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setImage('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso_Title.png')
        .setColor(message.guild.me.displayHexColor);

      for (const type of Object.values(types)) {
        if (type === types.OWNER) continue;
        if (commands[type][0]) embed.addField(`**${type} [${commands[type].length}]**`, commands[type].join(' '));
      }

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
