const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const types = ['info', 'fun', 'point', 'color', 'mod'];

// Remove specific array element
Array.prototype.remove = function(value) {
  var index = this.indexOf(value);
  if (index > -1) {
    this.splice(index, 1);
  }
  return this;
};

module.exports = class EnableCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'enable',
      aliases: ['en'],
      usage: 'enable <command | command type>',
      description: 'Enables the provided command or command type. All commands are enabled by default.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['enable ping', 'enable fun']
    });
  }
  run(message, args) {

    if (args.length === 0) 
      return this.sendErrorMessage(message, 'Invalid argument. Please provide a command or command type to enable.');
    if (args[0] === 'admin') 
      return this.sendErrorMessage(message, 'Invalid argument. `Admin` commands are always enabled.');

    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');
    const type = args[0];
    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    let description;

    // Handle types
    if (types.includes(type.toLowerCase())) {
      for (const cmd of message.client.commands.values()) {
        if (cmd.type === type  && disabledCommands.includes(cmd.name)) disabledCommands.remove(cmd.name);
      }
      description = `All \`${type}\` type commands have been successfully **enabled**.`;

    // Handle single commands
    } else if (command) {
      if (command.type === 'admin') 
        return this.sendErrorMessage(message, 'Invalid argument. `Admin` commands are always enabled.');
      disabledCommands.remove(command.name); // Remove from array
      description = `The \`${command.name}\` command has been successfully **enabled**.`;
    } else return this.sendErrorMessage(message, 'Invalid argument. Please provide a valid command.');

    message.client.db.settings.updateDisabledCommands.run(disabledCommands.join(' '), message.guild.id);

    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField('Setting', 'Disabled Commands', true)
      .addField('Current Value', disabledCommands.map(c => `\`${c}\``).join(' '), true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
