const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ColorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'colors',
      aliases: ['colorlist', 'cols', 'cs'],
      usage: 'colors',
      description: 'Displays a list of all available colors.',
      type: client.types.COLOR
    });
  }
  run(message) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const embed = new MessageEmbed()
      .setTitle('Available Colors')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    let colors = message.guild.roles.cache.filter(c => c.name.indexOf('#') === 0);
    if (colors.size === 0) 
      return message.channel.send(embed.setDescription('There are currently no colors set on this server.'));
    colors = colors.array()
      .sort((r1, r2) => (r1.position !== r2.position) ? r1.position - r2.position : r1.id - r2.id).reverse().join(' ');
    try {
      message.channel.send(embed.setDescription(`${colors}\n\nType \`${prefix}color <color name>\` to choose one.`));
    } catch (err) {
      this.sendErrorMessage(message, 'Something went wrong. There may be too many colors to display.', err.message);
    }
  }
};
