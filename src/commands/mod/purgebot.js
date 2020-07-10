const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class PurgeBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purgebot',
      aliases: ['clearbot'],
      usage: 'purgebot [channel mention/ID] <message count>',
      description: oneLine`
        Sifts through the specified amount of messages in the provided channel
        and deletes all Calypso commands and messages from Calypso.
        If no channel is given, the messages will be deleted from the current channel.
        No more than 100 messages may be sifted through at a time.
        Messages older than 2 weeks old cannot be deleted.
      `,
      type: types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      examples: ['purgebot 20']
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
    if(!reason) reason = 'No reason provided';
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix

    // Find messages
    let messages = await message.channel.messages.fetch({limit: amount});
    messages = messages.array().filter(msg => { // Filter for commands or bot messages
      const cmd = msg.content.trim().split(/ +/g).shift().slice(prefix.length).toLowerCase();
      const command = message.client.commands.get(cmd) || message.client.aliases.get(cmd);
      if (msg.author.bot || command) return true;
    });
    await message.delete(); // Delete command message

    channel.bulkDelete(messages, true).then(msgs => {
      const embed = new MessageEmbed()
        .setTitle('Purgebot')
        .setDescription(`Successfully deleted **${msgs.size}** messages.`)
        .addField('Channel', channel, true)
        .addField('Found Messages', `\`${msgs.size}\``, true)
        .addField('Reason', reason)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed).then(msg => msg.delete({ timeout: 5000 }));

      // Update modlog
      this.sendModlogMessage(message, reason, { Channel: channel, 'Found Messages': `\`${msgs.size}\`` });
    });
  }
};
