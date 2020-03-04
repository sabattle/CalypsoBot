const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class ColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'color',
      aliases: ['col', 'c'],
      usage: '<ROLE MENTION | COLOR NAME>',
      description: 'Changes your current color to the one specified.',
      type: 'general',
      clientPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES']    
    });
  }
  async run(message, args) {
    const colors = message.guild.roles.filter(c => c.name.indexOf('#') === 0);
    const colorName = args.join(' ').toLowerCase();
    const role = this.getRoleFromMention(message, args[0]);
    let color;
    if (role && colors.get(role.id)) color = role;
    if (!color) {
      color = colors.find(c => {
        return colorName.startsWith(c.name.slice(1).toLowerCase()) || colorName.startsWith(c.name.toLowerCase());
      });
    }
    // Color does not exist
    if (!color) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that color. Use \`!colors\` for a list.
    `);
    // Color exists but member already has color
    else if (message.member.roles.has(color.id)) 
      return message.channel.send(`${message.member}, you are already ${color}!`);
    // Color exists and member does not have color
    else {
      try {
        await message.member.removeRoles(colors);
        await message.member.addRole(color);
        message.channel.send(`${message.member}, you now have the color ${color}.`);
      } catch (err) {
        message.client.logger.error(err.message);
        message.channel.send(`Sorry ${message.member}, something went wrong. Please check the role hierarchy.`);
      }
    }
  }
};
