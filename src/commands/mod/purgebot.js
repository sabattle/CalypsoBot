const Command = require('../Command.js');
const Discord = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class PurgeBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purgebot',
      aliases: ['clearbot'],
      usage: '<MESSAGE COUNT>',
      description: oneLine`
        Sifts through the specified amount of messages and deletes any commands or messages from Calypso 
        (limit is 50 at a time).
      `,
      type: 'mod',
      clientPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES']
    });
  }
  async run(message, args) {
    const prefix = message.client.db.guildSettings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount <= 0 || amount > 50) 
      return message.channel.send(`${message.member}, please enter a number between 1 and 50.`);
    await message.delete();
    let messages = await message.channel.fetchMessages({limit: amount});
    messages = messages.array().filter(msg => { // Filter for commands or bot messages
      const command = message.client.commands.get(msg.content
        .trim().split(/ +/g).shift().slice(prefix.length).toLowerCase());
      if (msg.author.bot || command) return true;
    });
    messages.forEach(async msg => {
      await msg.delete();
    });
    message.channel.send(`I found **${messages.length}** messages (this message will be removed after 5 seconds).`)
      .then(msg => msg.delete(5000));

    // Update modlog
    const modlogChannelId = message.client.db.guildSettings.selectModlogChannelId.pluck().get(message.guild.id);
    let modlogChannel;
    if (modlogChannelId) modlogChannel = message.guild.channels.get(modlogChannelId);
    if (modlogChannel) {
      const embed = new Discord.RichEmbed()
        .setTitle('Action: `Purgebot`')
        .addField('Executor', message.member, true)
        .addField('Channel', message.channel, true)
        .addField('Message Count', amount, true)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      modlogChannel.send(embed).catch(err => message.client.logger.error(err.message));
    }
  }
};
