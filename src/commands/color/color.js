const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'color',
      aliases: ['changecolor', 'colour', 'c'],
      usage: 'color <role mention/ID | color name>',
      description: oneLine`
        Changes your current color to the one specified. Provide no color to clear your current color role.
      `,
      type: client.types.COLOR,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      examples: ['color Red']
    });
  }
  async run(message, args) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Color Change')
      .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
      .addField('Member', message.member, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    const colors = message.guild.roles.cache.filter(c => c.name.startsWith('#'));
    const colorName = args.join('').toLowerCase();
    const oldColor = (message.member.roles.color && message.member.roles.color.name.startsWith('#')) ? 
      message.member.roles.color : '`None`';

    // Clear if no color provided
    if (!colorName) {
      try {
        await message.member.roles.remove(colors);
        return message.channel.send(embed.addField('Color', `${oldColor} ➔ \`None\``, true));
      } catch (err) {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
      }
    }

    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    let color;
    if (role && colors.get(role.id)) color = role;
    if (!color) {
      color = colors.find(c => {
        return colorName == c.name.slice(1).toLowerCase().replace(/\s/g, '') || 
          colorName == c.name.toLowerCase().replace(/\s/g, '');
      });
    }
    // Color does not exist
    if (!color)
      return this.sendErrorMessage(message, 0, `Please provide a valid color, use ${prefix}colors for a list`);
    // Color exists
    else {
      try {
        await message.member.roles.remove(colors);
        await message.member.roles.add(color);
        message.channel.send(embed.addField('Color', `${oldColor} ➔ ${color}`, true).setColor(color.hexColor));
      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
      }
    }
  }
};
