const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const types = ['info', 'fun', 'point', 'color', 'mod'];

module.exports = class DisableTypeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'disabletype',
      aliases: ['disablet', 'distype', 'dist', 'dt'],
      usage: 'disable <command type>',
      description: oneLine`
        Disables the provided command type. 
        All commands belonging to that type will no longer be able to be used, and will no longer show up in \`help\`.
        The \`admin\` type is cannot be disabled.
      `,
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {

    if (args.length === 0) 
      return this.sendErrorMessage(message, 'Invalid argument. Please provide a command type to disable.');
    if (args[0] === 'admin') 
      return this.sendErrorMessage(message, 'Invalid argument. The `admin` type cannot be disabled.');

    const type = args[0];
    let status;
    if (types.includes(args[0].toLowerCase())) {
      let disabledTypes = message.client.db.settings.selectDisabledTypes.pluck().get(message.guild.id) || [];
      if (typeof(disabledTypes) === 'string') disabledTypes = disabledTypes.split();
      if (disabledTypes.includes(type)) status = '`disabled` ➔ `disabled`';
      else {
        disabledTypes.push(type);
        status = '`enabled` ➔ `disabled`';
        message.client.db.settings.updateDisabledTypes.run(disabledTypes.join(' '), message.guild.id);
      }
    } else return this.sendErrorMessage(message, 'Invalid argument. Please provide a valid command type.');

    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Command Type', `\`${type}\``, true)
      .addField('Current Status', status, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
