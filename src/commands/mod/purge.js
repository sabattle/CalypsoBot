const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['clear'],
      usage: '<MESSAGE COUNT>',
      description: 'Deletes the specified amount of messages from a channel (limit is 50 at a time).',
      type: 'mod',
      clientPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES']
    });
  }
  async run(message, args) {
    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount <= 0 || amount > 50) 
      return message.channel.send(`${message.member}, please enter a number between 1 and 50.`);
    await message.delete(); // delete command message
    const messages = await message.channel.fetchMessages({ limit: amount });
    messages.forEach(async msg => {
      await msg.delete();
    });

    // Update modlog
    const modlogChannelId = message.client.db.guildSettings.selectModlogChannelId.pluck().get(message.guild.id);
    let modlogChannel;
    if (modlogChannelId) modlogChannel = message.guild.channels.get(modlogChannelId);
    if (modlogChannel) {
      const embed = new Discord.RichEmbed()
        .setTitle('Action: `Purge`')
        .addField('Executor', message.member, true)
        .addField('Channel', message.channel, true)
        .addField('Message Count', amount, true)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      modlogChannel.send(embed).catch(err => message.client.logger.error(err.message));
    }
  }
};
