const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      usage: 'ban <user mention> [reason]',
      description: 'Bans a member from your server.',
      type: 'mod',
      clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      examples: ['ban @Nettles']
    });
  }
  async runf(message, args) {
    const member = this.getMemberFromMention(message, args[0]);
    if (!member) return this.sendErrorMessage(message, 'Invalid argument. Please mention a user.');
    if (member === message.member) return this.sendErrorMessage(message, 'Invalid argument. You cannot ban yourself.'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 'Invalid argument. You cannot ban someone with an equal or higher role.');
    if (!member.bannable) return this.sendErrorMessage(message, `Unable to ban ${member}.`);
    let reason = args.slice(1).join(' ');
    if(!reason) reason = 'No reason provided';
    await member.ban(reason);
    const embed = new MessageEmbed()
      .setTitle('Ban Member')
      .setDescription(`${member} was successfully banned.`)
      .addField('Executor', message.member, true)
      .addField('Member', member, true)
      .addField('Reason', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.member.displayName} banned ${member.displayName}`);

    // Update modlog
    const modlogChannelId = message.client.db.settings.selectModlogChannelId.pluck().get(message.guild.id);
    let modlogChannel;
    if (modlogChannelId) modlogChannel = message.guild.channels.cache.get(modlogChannelId);
    if (modlogChannel) {
      const modEmbed = new MessageEmbed()
        .setTitle('Action: `Ban`')
        .addField('Executor', message.member, true)
        .addField('Member', member, true)
        .addField('Reason', reason)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      modlogChannel.send(modEmbed).catch(err => message.client.logger.error(err.stack));
    }
  }
};
