const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class DisableCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'disablecommand',
      aliases: ['disablec', 'discommand', 'disc', 'dc'],
      usage: 'disable <command>',
      description: oneLine`
        Disables the provided command. 
        Disabled commands will no longer be able to be used, and will no longer show up in \`help\`.
        \`Admin\` commands cannot cannot be disabled.
      `,
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {

    if (args.length === 0) 
      return this.sendErrorMessage(message, 'Invalid argument. Please provide a command to disable.');

    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (!command) return this.sendErrorMessage(message, 'Invalid argument. Please provide a valid command.');
    if (command.type === 'admin') 
      return this.sendErrorMessage(message, 'Invalid argument. `Admin` commands cannot be disabled.');

    let status;
    let disabledCommands = message.client.db.settings.selectDisabledTypes.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split();
    if (disabledCommands.includes(command.name)) status = '`disabled` ➔ `disabled`';
    else {
      disabledCommands.push(command.name);
      status = '`enabled` ➔ `disabled`';
      message.client.db.settings.updateDisabledCommands.run(disabledCommands.join(' '), message.guild.id);
    }

    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Command', `\`${command.name}\``, true)
      .addField('Current Status', status, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
