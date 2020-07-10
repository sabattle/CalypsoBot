const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class WipeAllTotalPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wipealltotalpoints',
      aliases: ['wipeatp', 'watp'],
      usage: 'wipealltotalpoints <server ID>',
      description: 'Wipes all members\' points and total points in the server with the provided ID.',
      type: types.OWNER,
      ownerOnly: true,
      examples: ['wipealltotalpoints 264445053596991498']
    });
  }
  run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId)) return this.sendErrorMessage(message, 'Invalid argument. Please provide a valid server ID.');
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return this.sendErrorMessage(message, 'Unable to find server. Please check the provided ID.');
    message.client.db.users.wipeAllTotalPoints.run(guildId);
    const embed = new MessageEmbed()
      .setTitle('Wipe All Total Points')
      .setDescription(`Successfully wiped **${guild.name}**'s points and total points.`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  } 
};