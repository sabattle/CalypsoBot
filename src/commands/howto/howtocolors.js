const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class HowToColorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'howtocolors',
      aliases: ['h2colors'],
      usage: '',
      description: 'Explains how to set up colors on your server.',
      type: 'howto'
    });
  }
  run(message) {
    const prefix = message.client.db.guildSettings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const part1 = oneLine`
      Colors can be set up by creating roles beginning with \`#\` that have specific color hexes. For example, **#Red**
      or **#Blue**. These roles should have cleared permissions and be at the bottom of the role hierarchy.
    `;
    const part2 = `Once set, server members can see all available colors by using the command \`${prefix}colors\`.`;
    const part3 = oneLine`
      To choose a specific color, members can use the \`${prefix}color\` command followed by a specific color name or a
      role mention. For example, \`${prefix}color Red\`.
  `;
    message.channel.send(part1 + '\n\n' + part2 + '\n\n' + part3);
  }
};
