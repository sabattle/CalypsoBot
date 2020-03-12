const Command = require('../Command.js');

module.exports = class ColorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'colors',
      aliases: ['cols'],
      usage: '',
      description: 'Displays a list of all available colors.',
      type: 'general'
    });
  }
  run(message) {
    const prefix = message.client.db.guildSettings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    let colors = message.guild.roles.filter(c => c.name.indexOf('#') === 0);
    if (colors.size === 0) return message.channel.send('There are currently no colors set on this server');
    colors = colors.array()
      .sort((r1, r2) => (r1.position !== r2.position) ? r1.position - r2.position : r1.id - r2.id).reverse().join(' ');
    try {
      message.channel.send(`
      Here are all of the colors I found:\n\n${colors}\n\nType \`${prefix}color <COLOR NAME>\` to choose one.
    `);
    } catch (err) {
      message.channel.send(`Sorry ${message.member}, something went wrong. There may be too many colors to display.`);
    }
  }
};
