const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['clear'],
      usage: 'purge [channel mention/ID] <message count> [reason]',
      description: oneLine`
        Deletes the specified amount of messages from the provided channel. 
        If no channel is given, the messages will be deleted from the current channel.
        No more than 100 messages may be deleted at a time.
        Messages older than 2 weeks old cannot be deleted.
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      examples: ['purge 20', 'purge #general 10 ']
    });
  }
  async run(message, args) {

    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;
    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 'Invalid argument. Please provide a message count between 1 and 100.');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'No reason provided';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await message.delete(); // Delete command message
    channel.bulkDelete(amount, true).then(messages => {
      const embed = new MessageEmbed()
        .setTitle('Purge')
        .setDescription(`Successfully deleted **${messages.size}** messages.`)
        .addField('Channel', channel, true)
        .addField('Message Count', `\`${messages.size}\``, true)
        .addField('Reason', reason)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed).then(msg => msg.delete({ timeout: 5000 }));

      // Update modlog
      this.sendModlogMessage(message, reason, { Channel: channel, 'Message Count': `\`${messages.size}\`` });
    });

  }
};
