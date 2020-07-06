const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ChangeColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'changecolor',
      aliases: ['changecol', 'changec', 'cc'],
      usage: 'changecolor <role mention | color name>',
      description: oneLine`
        Changes your current color to the one specified. Provide no color to clear your current color role.
      `,
      type: 'color',
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      examples: ['changecolor Red']
    });
  }
  async run(message, args) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const embed = new MessageEmbed()
      .setTitle('Color Change')
      .setThumbnail('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso.png')
      .addField('Member', message.member, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    const colors = message.guild.roles.cache.filter(c => c.name.indexOf('#') === 0);
    const colorName = args.join(' ').toLowerCase();
    const oldColor = message.member.roles.color || '`None`';

    // Clear if no color provided
    if (!colorName) {
      try {
        await message.member.roles.remove(colors);
        return message.channel.send(embed.addField('Color', `${oldColor} ➔ \`None\``, true));
      } catch (err) {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 'Something went wrong. Please check the role hierarchy.', err.message);
      }
    }

    const role = this.getRoleFromMention(message, args[0]);
    let color;
    if (role && colors.get(role.id)) color = role;
    if (!color) {
      color = colors.find(c => {
        return colorName == c.name.slice(1).toLowerCase() || colorName == c.name.toLowerCase();
      });
    }
    // Color does not exist
    if (!color) return this.sendErrorMessage(message, `Invalid color. Use \`${prefix}colors\` for a list.`);
    // Color exists
    else {
      try {
        await message.member.roles.remove(colors);
        await message.member.roles.add(color);
        message.channel.send(embed.addField('Color', `${oldColor} ➔ ${color}`, true).setColor(color.hexColor));
      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 'Something went wrong. Please check the role hierarchy.', err.message);
      }
    }
  }
};
