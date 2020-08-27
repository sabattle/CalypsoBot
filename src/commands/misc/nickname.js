const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class NicknameCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'nickname',
      aliases: ['changenickname', 'nick', 'nn'],
      usage: 'nickname <nickname>',
      description: 'Changes your own nickname to the one specified. The nickname cannot be larger than 32 characters.',
      type: client.types.MISC,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_NICKNAMES'],
      userPermissions: ['CHANGE_NICKNAME'],
      examples: ['nickname Billy Zane']
    });
  }
  async run(message, args) {

    if (!args[0]) return this.sendErrorMessage(message, 0, 'Please provide a nickname');
    const nickname = message.content.slice(message.content.indexOf(args[0]), message.content.length);

    if (nickname.length > 32) {
      return this.sendErrorMessage(message, 0, 'Please ensure the nickname is no larger than 32 characters');
    } else if (message.member === message.guild.owner) {
      return this.sendErrorMessage(message, 1, 'Unable to change the nickname of server owner');
    } else {
      try {

        // Change nickname
        const oldNickname = message.member.nickname || '`None`';
        const nicknameStatus = `${oldNickname} ➔ ${nickname}`;
        await message.member.setNickname(nickname);
        const embed = new MessageEmbed()
          .setTitle('Change Nickname')
          .setDescription(`${message.member}'s nickname was successfully updated.`)
          .addField('Member', message.member, true)
          .addField('Nickname', nicknameStatus, true)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);

      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
      }
    }  
  }
};