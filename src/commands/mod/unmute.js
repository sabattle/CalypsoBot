const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class UnmuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unmute',
      usage: '<USER MENTION>',
      description: 'Unmutes the specified user.',
      type: 'mod',
      clientPermissions: ['SEND_MESSAGES', 'MUTE_MEMBERS', 'MANAGE_ROLES'],
      userPermissions: ['MUTE_MEMBERS']
    });
  }
  async run(message, args) {
    const id = message.client.db.guildSettings.selectMuteRoleId.pluck().get(message.guild.id);
    let muteRole;
    if (id) muteRole = message.guild.roles.get(id);
    else return message.channel.send('There is currently no `mute role` set on this server.');
    const member = this.getMemberFromMention(message, args[0]);
    if (!member) return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please mention a user.`);
    if (member.highestRole.position >= message.member.highestRole.position)
      return message.channel.send(`${message.member}, you cannot unmute someone who has an equal or higher role.`);
    if (member.roles.has(id)) {
      message.client.clearTimeout(member.timeout);
      try {
        await member.removeRole(muteRole);
        message.channel.send(`${member} has been unmuted.`);
      } catch (err) {
        message.client.logger.error(err.message);
        return message.channel.send(`Sorry ${message.member}, something went wrong. Please check the role hierarchy.`);
      }
    } else return message.channel.send(`${member} is not muted!`);
    
    // Update modlog
    const modlogChannelId = message.client.db.guildSettings.selectModlogChannelId.pluck().get(message.guild.id);
    let modlogChannel;
    if (modlogChannelId) modlogChannel = message.guild.channels.get(modlogChannelId);
    if (modlogChannel) {
      const embed = new Discord.RichEmbed()
        .setTitle('Action: `Unmute`')
        .addField('Executor', message.member, true)
        .addField('Member', member, true)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      modlogChannel.send(embed).catch(err => message.client.logger.error(err.message));
    }  
  }
};
