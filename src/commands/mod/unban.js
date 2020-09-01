const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class UnbanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      usage: 'unban <user ID> [reason]',
      description: 'Unbans a member from your server.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      examples: ['unban 134672335474130944']
    });
  }
  async run(message, args) {
    const id = args[0];
    if (!rgx.test(id)) return this.sendErrorMessage(message, 0, 'Please provide a valid user ID');
    const bannedUsers = await message.guild.fetchBans();
    const user = bannedUsers.get(id).user;
    if (!user) return this.sendErrorMessage(message, 0, 'Unable to find user, please check the provided ID');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await message.guild.members.unban(user, reason);
    const embed = new MessageEmbed()
      .setTitle('Unban Member')
      .setDescription(`${user.tag} was successfully unbanned.`)
      .addField('Moderator', message.member, true)
      .addField('Member', user.tag, true)
      .addField('Reason', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} unbanned ${user.tag}`);
    
    // Update mod log
    this.sendModLogMessage(message, reason, { Member: user.tag });
  }
};
