const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { pong } = require('../../utils/emojis.json');
const { stripIndent } = require('common-tags');

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      usage: 'ping',
      description: 'Gets Calypso\'s current latency and API latency.',
      type: client.types.INFO
    });
  }
  async run(message) {
    const embed = new MessageEmbed()
      .setDescription('Pinging...')
      .setColor(message.guild.me.displayHexColor);    
    const msg = await message.channel.send(embed);
    const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp; // Check if edited
    const ping = stripIndent`
      Latency: ${Math.floor(msg.createdTimestamp - timestamp)}ms
      API Latency: ${Math.round(message.client.ws.ping)}ms
    `;
    embed.setTitle(`Pong!  ${pong}`)
      .setDescription(`\`\`\`prolog\n${ping}\`\`\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    msg.edit(embed);
  }
};
