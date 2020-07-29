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
   
    let colors = message.guild.roles.cache.filter(c => c.name.startsWith('#'));
    let description;
    if (colors.size === 0) description = 'No colors found.';
    else {
      const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
      const colorList = colors.sort((a, b) => b.position - a.position).array().join(' ');
      description = `${colorList}\n\nType \`${prefix}color <color name>\` to choose one.`;
    }

    try {
      const embed = new MessageEmbed()
        .setTitle(`Available Colors [${colors.size}]`)
        .setDescription(description)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      this.sendErrorMessage(message, 'Something went wrong. There may be too many colors to display.', err.message);
    }
  }
};
