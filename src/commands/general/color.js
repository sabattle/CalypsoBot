const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class ColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'color',
      usage: '<COLOR NAME>',
      description: 'Changes your current color to the one specified.',
      type: 'general',
      clientPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES']    
    });
  }
  async run(message, args) {
    const colors = message.guild.roles.filter(c => c.name.indexOf('#') === 0);
    const target = args.join(' ').toLowerCase();
    const color = colors.find(c => {
      return target.startsWith(c.name.slice(1).toLowerCase()) || 
             target.startsWith(c.name.toLowerCase()) || 
             message.mentions.roles.first();
    });
    // Color does not exist
    if (!color) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that color. Type \`!colors\` for a list.
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
      }
      catch (err) {
        message.client.logger.error(err.message);
        message.channel.send(oneLine`
          Sorry ${message.member}, something went wrong. Please confirm that I am at the top of the role hierarchy.
        `);
      }
    }
  }
};
