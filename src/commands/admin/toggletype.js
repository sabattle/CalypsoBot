const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ToggleTypeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'toggletype',
      aliases: ['togglet', 'togt', 'tt'],
      usage: 'toggletype <command type>',
      description: oneLine`
        Enables or disables the provided command type.
        Commands of the provided type will disabled unless they are all already disabled,
        in which case they will be enabled. 
        Disabled commands will no longer be able to be used, and will no longer show up with the \`help\` command.
        \`${client.types.ADMIN}\` commands cannot be disabled.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['toggletype Fun']
    });
  }
  run(message, args) {

    if (args.length === 0 || args[0].toLowerCase() === message.client.types.OWNER.toLowerCase())
      return this.sendErrorMessage(message, 'Invalid argument. Please provide a valid command type.');
    
    const type = args[0].toLowerCase();
    
    if (type === message.client.types.ADMIN.toLowerCase()) 
      return this.sendErrorMessage(message, `
        Invalid argument. \`${message.client.types.ADMIN}\` commands cannot be disabled.
      `);

    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    let description;

    // Map types
    const typeListOrig = Object.values(message.client.types);
    const typeList = typeListOrig.map(t => t.toLowerCase());
    const commands = message.client.commands.array().filter(c => c.type.toLowerCase() === type);

    // Disable type
    if (typeList.includes(type)) {

      // Enable type
      if (disabledCommands.length === commands.length) {
        for (const cmd of commands) {
          if (disabledCommands.includes(cmd.name)) message.client.utils.removeElement(disabledCommands, cmd.name);
        }
        description = oneLine`
          All \`${typeListOrig[typeList.indexOf(type)]}\` type commands have been successfully 
          **enabled**. <:success:736449240728993802>
        `;
      
      // Disable type
      } else {
        for (const cmd of commands) {
          if (!disabledCommands.includes(cmd.name)) disabledCommands.push(cmd.name);
        }
        description = oneLine`
          All \`${typeListOrig[typeList.indexOf(type)]}\` type commands have been successfully 
          **disabled**. <:fail:736449226120233031>
        `;
      }
    } else return this.sendErrorMessage(message, 'Invalid argument. Please provide a valid command type.');
      
    message.client.db.settings.updateDisabledCommands.run(disabledCommands.join(' '), message.guild.id);

    disabledCommands = disabledCommands.map(c => `\`${c}\``).join(' ') || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Setting: `Disabled Commands`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField('Disabled Commands', disabledCommands, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
