const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AliasesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'aliases',
      aliases: ['alias', 'ali'],
      usage: 'aliases',
      description: 'Displays a list of all current aliases per command.',
      type: client.types.INFO
    });
  }
  run(message) {

    // Get disabled commands
    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const aliases = {};
    for (const type of Object.values(message.client.types)) {
      aliases[type] = [];
    }

    message.client.commands.forEach(command => {
      if (command.aliases && !disabledCommands.includes(command.name)) 
        aliases[command.type].push(`**${command.name}**: ${command.aliases.map(a => `\`${a}\``).join(' ')}`);
    });

    const emojiMap = {
      [message.client.types.INFO]: `<:pin_unread:735343728679714907> ${message.client.types.INFO}`,
      [message.client.types.FUN]: `<:add_reaction:735344430512341163> ${message.client.types.FUN}`,
      [message.client.types.COLOR]: `<:store_tag:735661829828771860> ${message.client.types.COLOR}`,
      [message.client.types.POINTS]: `<:members:735661916906717276> ${message.client.types.POINTS}`,
      [message.client.types.MISC]: `<:mention:735344543125471242> ${message.client.types.MISC}`,
      [message.client.types.MOD]: `<:moderation:735343938361360404> ${message.client.types.MOD}`,
      [message.client.types.ADMIN]: `<:settings:735343627051728926> ${message.client.types.ADMIN}`,
    };

    const embed = new MessageEmbed()
      .setTitle('Alias List')
      .setThumbnail('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso.png')
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    for (const type of Object.values(message.client.types)) {
      if (type === message.client.types.OWNER) continue;
      if (aliases[type][0]) embed.addField(`**${emojiMap[type]} [${aliases[type].length}]**`, aliases[type].join('\n'));
    }

    message.channel.send(embed);
  }
};
