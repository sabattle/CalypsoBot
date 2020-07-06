const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      usage: 'ping',
      description: 'Gets Calypso\'s current latency and API latency.',
      type: 'info'
    });
  }
  async run(message) {
    const embed = new MessageEmbed()
      .setDescription('Pinging...')
      .setColor(message.guild.me.displayHexColor);    
    const msg = await message.channel.send(embed);
    embed.setTitle('🏓 Pong!')
      .setDescription(`
        **Latency:** \`${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\`
        **API Latency:** \`${Math.round(message.client.ws.ping)}ms\`
      `)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    msg.edit(embed);
  }
};
