const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class PurgeBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purgebot',
      aliases: ['clearbot'],
      usage: 'purgebot [channel mention/ID] <message count> [reason]',
      description: oneLine`
        Sifts through the specified amount of messages in the provided channel
        and deletes all Calypso commands and messages from Calypso.
        If no channel is given, the messages will be deleted from the current channel.
        No more than 100 messages may be sifted through at a time.
        Messages older than 2 weeks old cannot be deleted.
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      examples: ['purgebot 20']
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

    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Please provide a message count between 1 and 100');

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_MESSAGES']))
      return this.sendErrorMessage(message, 0, 'I do not have permission to manage messages in the provided channel');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix

    await message.delete(); // Delete command message

    // Find messages
    let messages = (await message.channel.messages.fetch({limit: amount})).filter(msg => { // Filter for commands or bot messages
      const cmd = msg.content.trim().split(/ +/g).shift().slice(prefix.length).toLowerCase();
      const command = message.client.commands.get(cmd) || message.client.aliases.get(cmd);
      if (msg.author.bot || command) return true;
    });

    if (messages.size === 0) { // No messages found

      message.channel.send(
        new MessageEmbed()
          .setTitle('Purgebot')
          .setDescription(`
            Unable to find any bot messages or commands. 
            This message will be deleted after \`10 seconds\`.
          `)
          .addField('Channel', channel, true)
          .addField('Found Messages', `\`${messages.size}\``, true)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor)
      ).then(msg => msg.delete({ timeout: 10000 })).catch(err => message.client.logger.error(err.stack));

    } else { // Purge messages
      
      channel.bulkDelete(messages, true).then(msgs => { 
        const embed = new MessageEmbed()
          .setTitle('Purgebot')
          .setDescription(`
            Successfully deleted **${msgs.size}** message(s). 
            This message will be deleted after \`10 seconds\`.
          `)
          .addField('Channel', channel, true)
          .addField('Found Messages', `\`${msgs.size}\``, true)
          .addField('Reason', reason)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);

        message.channel.send(embed).then(msg => msg.delete({ timeout: 10000 }))
          .catch(err => message.client.logger.error(err.stack));
      });
    }
    
    // Update mod log
    this.sendModLogMessage(message, reason, { Channel: channel, 'Found Messages': `\`${messages.size}\`` });
  }
};
