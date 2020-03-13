const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class SlowmodeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'slowmode',
      aliases: ['slow', 'sm'],
      usage: '<CHANNEL MENTION> <RATE> <REASON>',
      description: 'Enables slowmode in a channel with the specified rate (provide a rate of 0 to disable).',
      type: 'mod',
      clientPermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS']
    });
  }
  async run(message, args) {
    let offset = 1;
    let channel = this.getChannelFromMention(message, args[0]);
    if (!channel) {
      channel = message.channel;
      offset--;
    }
    const rate = args[offset];
    if (!rate || rate < 0 || rate > 59) 
      return message.channel.send(`${message.member}, please provide a rate limit between 0 and 59 seconds.`);
    let reason = args.slice(offset + 1).join(' ');
    if(!reason) reason = 'No reason provided';
    await channel.setRateLimitPerUser(rate, reason); // set channel rate

    // Slowmode disabled
    if (rate === '0') {
      return message.channel.send(`Slowmode in ${channel} has been **disabled**.`);
    
      // Slowmode enabled
    } else {

      // Update modlog
      const modlogChannelId = message.client.db.guildSettings.selectModlogChannelId.pluck().get(message.guild.id);
      let modlogChannel;
      if (modlogChannelId) modlogChannel = message.guild.channels.get(modlogChannelId);
      if (modlogChannel) {
        const embed = new Discord.RichEmbed()
          .setTitle('Action: `Slowmode`')
          .addField('Executor', message.member, true)
          .addField('Channel', channel, true)
          .addField('Rate', rate, true)
          .addField('Reason', reason)
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        modlogChannel.send(embed).catch(err => message.client.logger.error(err.message));
      }   
      return message.channel.send(`Slowmode in ${channel} has been **enabled** with a rate of **${rate}s**.`);
    }
  }
};
