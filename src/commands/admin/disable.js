const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const types = ['info', 'fun', 'point', 'color', 'mod'];

module.exports = class DisableCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'disable',
      aliases: ['dis'],
      usage: 'disable <command | command type>',
      description: oneLine`
        Disables the provided command or command type. 
        Disabled commands will no longer be able to be used, and will no longer show up with the \`help\` command.
        \`Admin\` commands cannot be disabled.
      `,
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['disable ping', 'disable fun']
    });
  }
  run(message, args) {

    if (args.length === 0) 
      return this.sendErrorMessage(message, 'Invalid argument. Please provide a command or command type to disable.');
    if (args[0] === 'admin') 
      return this.sendErrorMessage(message, 'Invalid argument. `Admin` commands cannot be disabled.');

    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');
    const type = args[0];
    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);

    // Handle types
    if (types.includes(type.toLowerCase())) {
      for (const cmd of message.client.commands.values()) {
        if (cmd.type === type  && !disabledCommands.includes(cmd.name)) disabledCommands.push(cmd.name);
      }
    
    // Handle single commands
    } else if (command) {
      if (command.type === 'admin') 
        return this.sendErrorMessage(message, 'Invalid argument. `Admin` commands cannot be disabled.');
      if (!disabledCommands.includes(command.name)) disabledCommands.push(command.name); // Add to array if not present
    } else return this.sendErrorMessage(message, 'Invalid argument. Please provide a valid command.');

    message.client.db.settings.updateDisabledCommands.run(disabledCommands.join(' '), message.guild.id);

    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', 'Disabled Commands', true)
      .addField('Current Value', disabledCommands.map(c => `\`${c}\``).join(' '), true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
