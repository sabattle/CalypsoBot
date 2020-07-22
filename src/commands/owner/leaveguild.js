const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class LeaveGuildCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leaveguild',
      usage: 'leaveguild <server ID>',
      description: 'Forces Calypso to leave the specified server.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['leaveguild 709992782252474429']
    });
  }
  async run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId)) return this.sendErrorMessage(message, 'Invalid argument. Please provide a valid server ID.');
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return this.sendErrorMessage(message, 'Unable to find server. Please check the provided ID.');
    await guild.leave();
    const embed = new MessageEmbed()
      .setTitle('Leave Guild')
      .setDescription(`I have sucessfully left **${guild.name}**.`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  } 
};
