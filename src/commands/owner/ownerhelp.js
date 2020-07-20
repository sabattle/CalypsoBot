const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class OwnerHelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ownerhelp',
      aliases: ['ownercommands', 'ohelp', 'oh'],
      usage: 'ownerhelp [command]',
      description: 'Displays a list of all current owner commands.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['ownerhelp blast']
    });
  }
  run(message, args) {

    const embed = new MessageEmbed();
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    
    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (command && command.type == message.client.types.OWNER) {
      
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
      const commands = [];
  
      message.client.commands.forEach(command => {
        if (command.type === message.client.types.OWNER) commands.push(`\`${command.name}\``);
      });

      embed // Build help embed
        .setTitle('Calypso\'s Owner Commands')
        .setImage('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso_Title.png')
        .setDescription(stripIndent`
          The prefix on **${message.guild.name}** is \`${prefix}\`
          Use \`${prefix}ownerhelp [command]\` for more information 
        `)
        .addField(`**${message.client.types.OWNER} [${commands.length}]**`, commands.join(' '))
        .addField(
          '**Links**', 
          '**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=416451977380364288&scope=bot&permissions=403008599) | ' +
          '[Support Server](https://discord.gg/pnYVdut) | ' +
          '[Repository](https://github.com/sabattle/CalypsoBot)**'
        )
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);      
    }
    message.channel.send(embed);
  }
};
