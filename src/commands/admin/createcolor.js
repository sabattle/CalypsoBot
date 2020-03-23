const Command = require('../Command.js');
const { oneLine } = require('common-tags');

// Color hex regex
const rgx = /^#?[0-9A-F]{6}$/i;

module.exports = class CreateColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'createcolor',
      aliases: ['cc'],
      usage: '<HEX> <COLOR NAME>',
      description: 'Creates a new role for the given color hex.',
      type: 'admin',
      userPermissions: ['MANAGE_ROLES'],
      clientPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES']
    });
  }
  async run(message, args) {
    const hex = args.shift();
    if (args.length === 0 || !rgx.test(hex)) {
      return message.channel.send(oneLine`
        Sorry ${message.member}, I don't recognize that. Please provide a color hex and a color name.
      `);
    } 
    let colorName = args.join(' ').toLowerCase();
    if (!colorName.startsWith('#')) colorName = '#' + colorName;
    try {
      const role = await message.guild.createRole({
        name: colorName,
        color: hex,
        permissions: []
      });
      message.channel.send(`Successfully created the ${role} color.`);
    } catch (err) {
      message.client.logger.error(err);
      message.channel.send(`Sorry ${message.member}, something went wrong. Please try again.`);
    }
  }
};
