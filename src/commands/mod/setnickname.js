const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetNicknameCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setnickname',
      aliases: ['setnn', 'snn'],
      usage: 'setnickname <user mention/ID> <nickname> [reason]',
      description: oneLine`
        Changes the provided user's nickname to the one specified.
        Surround the new nickname in quotes if it is more than one word.
        The nickname cannot be larger than 32 characters.
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_NICKNAMES'],
      userPermissions: ['MANAGE_NICKNAMES'],
      examples: ['setnickname @Nettles Noodles', 'setnickname @Nettles "Val Kilmer"']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member.roles.highest.position >= message.member.roles.highest.position && member != message.member)
      return this.sendErrorMessage(message, 0, stripIndent`
        You cannot change the nickname of someone with an equal or higher role
      `);

    if (!args[1]) return this.sendErrorMessage(message, 0, 'Please provide a nickname');

    // Multi-word nickname
    let nickname = args[1];
    if (nickname.startsWith('"')) {
      nickname = message.content.slice(message.content.indexOf(args[1]) + 1);
      if (!nickname.includes('"')) 
        return this.sendErrorMessage(message, 0, 'Please ensure the nickname is surrounded in quotes');
      nickname = nickname.slice(0, nickname.indexOf('"'));
      if (!nickname.replace(/\s/g, '').length) return this.sendErrorMessage(message, 0, 'Please provide a nickname');
    }

    if (nickname.length > 32) {
      return this.sendErrorMessage(message, 0, 'Please ensure the nickname is no larger than 32 characters');
      
    } else {

      let reason;
      if (args[1].startsWith('"')) 
        reason = message.content.slice(message.content.indexOf(nickname) + nickname.length + 1);
      else reason = message.content.slice(message.content.indexOf(nickname) + nickname.length);
      if (!reason) reason = '`None`';
      if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

      try {

        // Change nickname
        const oldNickname = member.nickname || '`None`';
        const nicknameStatus = `${oldNickname} ➔ ${nickname}`;
        await member.setNickname(nickname);
        const embed = new MessageEmbed()
          .setTitle('Set Nickname')
          .setDescription(`${member}'s nickname was successfully updated.`)
          .addField('Moderator', message.member, true)
          .addField('Member', member, true)
          .addField('Nickname', nicknameStatus, true)
          .addField('Reason', reason)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);

        // Update mod log
        this.sendModLogMessage(message, reason, { Member: member, Nickname: nicknameStatus });

      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
      }
    }  
  }
};