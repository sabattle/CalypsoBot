const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class ColorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'colors',
      usage: '',
      description: 'Displays a list of all available colors.',
      type: 'general'
    });
  }
  run(message) {
    let colors = message.guild.roles.filter(c => c.name.indexOf('#') === 0);
    if (colors.size === 0) return message.channel.send(oneLine`
      There are currently no colors set on this server. Colors can be set up by creating roles beginning with \`#\` 
      that have various color hexes. These roles should be at the bottom of the role hierarchy.`
    );
    colors = colors.array()
      .sort((r1, r2) => (r1.position !== r2.position) ? r1.position - r2.position : r1.id - r2.id).reverse().join(' ');
    message.channel.send(`
      Here are all of the colors I found:\n\n${colors}\n\nType \`!color <COLOR NAME>\` to choose one.
    `);
  }
};
