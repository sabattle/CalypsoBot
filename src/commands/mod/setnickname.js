const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

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
    if (!member) return this.sendErrorMessage(message, 'Invalid argument. Please mention a user or provide a user ID.');
    if (member.roles.highest.position >= message.member.roles.highest.position && member != message.member)
      return this.sendErrorMessage(message, `
        Invalid argument. You cannot change the nickname of someone with an equal or higher role.
      `);

    let nickname;
    if (args[1].startsWith('"')) {
      nickname = message.content.slice(message.content.indexOf(args[1]) + 1);
      nickname = nickname.slice(0, nickname.indexOf('"'));
    } else {
      nickname = args[1];
    }
  
    if (!nickname) return this.sendErrorMessage(message, 'Invalid nickname. Please provide a valid nickname.');
    else if (nickname.length > 32) {
      return this.sendErrorMessage(message, `
        Invalid nickname. Please ensure the nickname is no larger than 32 characters.
      `);
    } else {

      let reason = message.content.split(nickname)[1];
      if (!reason) reason = 'No reason provided';
      if (reason.length > 1024) reason = reason.slice(1021) + '...';

      try {

        // Change nickname
        const oldNickname = member.nickname || '`None`';
        const nicknameStatus = `${oldNickname} ➔ ${nickname}`;
        await member.setNickname(nickname);
        const embed = new MessageEmbed()
          .setTitle('Set Nickname')
          .setDescription(`${member}'s nickname was succesfully updated.`)
          .addField('Executor', message.member, true)
          .addField('Member', member, true)
          .addField('Nickname', nicknameStatus, true)
          .addField('Reason', reason)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);

        // Update modlog
        this.sendModlogMessage(message, reason, { Member: member, Nickname: nicknameStatus });

      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 'Something went wrong. Please check the role hierarchy.', err.message);
      }
    }  
  }
};