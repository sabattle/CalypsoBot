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
    message.channel.send(
      'Colors can be set up by creating roles beginning with `#` that have specific color hexes. For example, ' +
      '**#Red** or **#Blue**. These roles should have cleared permissions and be at the bottom of the role hierarchy. ' +
      `Alternatively, you can use the \`${prefix}createcolor\` command to easily generate a new color!` +
      `\n\nOnce set, server members can see all available colors by using the command \`${prefix}colors\`.\n\n` +
      oneLine`To choose a specific color, members can use the \`${prefix}color\` command followed by a specific color 
      name or a role mention. For example, \`${prefix}color Red\`.`
    );
  }
};
