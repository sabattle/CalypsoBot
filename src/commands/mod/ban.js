const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      usage: '<USER MENTION> <REASON>',
      description: 'Bans a member from your server.',
      type: 'mod',
      clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS']
    });
  }
  async run(message, args) {
    const member = this.getMemberFromMention(message, args[0]);
    if (!member) return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please mention a user.`);
    if (member === message.member) return message.channel.send('You cannot ban yourself.'); 
    if (member.highestRole.position >= message.member.highestRole.position)
      return message.channel.send(`${message.member}, you cannot ban someone who has an equal or higher role.`);
    if (!member.bannable) return message.channel.send(`I am unable to ban ${member}.`);
    let reason = args.slice(1).join(' ');
    if(!reason) reason = 'No reason provided';
    await member.ban(reason);
    message.channel.send(`I have successfully banned ${member}.`);
    message.client.logger.info(`${message.guild.name}: ${message.member.displayName} banned ${member.displayName}`);

    // Update modlog
    const modlogChannelId = message.client.db.guildSettings.selectModlogChannelId.pluck().get(message.guild.id);
    let modlogChannel;
    if (modlogChannelId) modlogChannel = message.guild.channels.get(modlogChannelId);
    if (modlogChannel) {
      const embed = new Discord.RichEmbed()
        .setTitle('Action: `Ban`')
        .addField('Executor', message.member, true)
        .addField('Member', member, true)
        .addField('Reason', reason)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      modlogChannel.send(embed).catch(err => message.client.logger.error(err.message));
    }
  }
};
