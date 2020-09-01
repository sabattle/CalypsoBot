const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['clear'],
      usage: 'purge [channel mention/ID] [user mention/ID] <message count> [reason]',
      description: oneLine`
        Deletes the specified amount of messages from the provided channel. 
        If no channel is given, the messages will be deleted from the current channel.
        If a member is provided, only their messages will be deleted from the batch.
        No more than 100 messages may be deleted at a time.
        Messages older than 2 weeks old cannot be deleted.
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      examples: ['purge 20', 'purge #general 10', 'purge @Nettles 50', 'purge #general @Nettles 5']
    });
  }
  async run(message, args) {

    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    // Check type and viewable
    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
      Please mention an accessible text channel or provide a valid text channel ID
    `);

    let member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (member) {
      args.shift();
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Please provide a message count between 1 and 100');

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_MESSAGES']))
      return this.sendErrorMessage(message, 0, 'I do not have permission to manage messages in the provided channel');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await message.delete(); // Delete command message

    // Find member messages if given
    let messages;
    if (member) {
      messages = (await channel.messages.fetch({ limit: amount })).filter(m => m.member.id === member.id);
    } else messages = amount;

    if (messages.size === 0) { // No messages found

      message.channel.send(
        new MessageEmbed()
          .setTitle('Purge')
          .setDescription(`
            Unable to find any messages from ${member}. 
            This message will be deleted after \`10 seconds\`.
          `)
          .addField('Channel', channel, true)
          .addField('Member', member )
          .addField('Found Messages', `\`${messages.size}\``, true)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor)
      ).then(msg => msg.delete({ timeout: 10000 })).catch(err => message.client.logger.error(err.stack));

    } else { // Purge messages

      channel.bulkDelete(messages, true).then(messages => {
        const embed = new MessageEmbed()
          .setTitle('Purge')
          .setDescription(`
            Successfully deleted **${messages.size}** message(s). 
            This message will be deleted after \`10 seconds\`.
          `)
          .addField('Channel', channel, true)
          .addField('Message Count', `\`${messages.size}\``, true)
          .addField('Reason', reason)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
  
        if (member) {
          embed
            .spliceFields(1, 1, { name: 'Found Messages', value:  `\`${messages.size}\``, inline: true})
            .spliceFields(1, 0, { name: 'Member', value: member, inline: true});
        }

        message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
          .catch(err => message.client.logger.error(err.stack));
      });
    }
    
    // Update mod log
    const fields = { 
      Channel: channel
    };

    if (member) {
      fields['Member'] = member;
      fields['Found Messages'] = `\`${messages.size}\``;
    } else fields['Message Count'] = `\`${amount}\``;

    this.sendModLogMessage(message, reason, fields);

  }
};
