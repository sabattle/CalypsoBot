const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetFarewellChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setfarewellchannel',
      aliases: ['setfc', 'sfc'],
      usage: 'setfarewellchannel <channel mention/ID>',
      description: oneLine`
        Sets the farewell message text channel for your server. 
        Provide no channel to clear the current \`farewell channel\`.
        A \`farewell message\` must also be set to enable farewell messages.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setfarewellchannel #general']
    });
  }
  run(message, args) {
    let { farewell_channel_id: farewellChannelId, farewell_message: farewellMessage } = 
      message.client.db.settings.selectFarewells.get(message.guild.id);
    const oldFarewellChannel = message.guild.channels.cache.get(farewellChannelId) || '`None`';

    // Get status
    const oldStatus = message.client.utils.getStatus(farewellChannelId, farewellMessage);

    // Trim message
    if (farewellMessage && farewellMessage.length > 1024) farewellMessage = farewellMessage.slice(0, 1021) + '...';
    
    const embed = new MessageEmbed()
      .setTitle('Settings: `Farewells`')
      .setDescription(`The \`farewell channel\` was successfully updated. ${success}`)
      .addField('Message', message.client.utils.replaceKeywords(farewellMessage) || '`None`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateFarewellChannelId.run(null, message.guild.id);

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 
      
      return message.channel.send(embed
        .spliceFields(0, 0, { name: 'Channel', value: `${oldFarewellChannel} ➔ \`None\``, inline: true })
        .spliceFields(1, 0, { name: 'Status', value: statusUpdate, inline: true })
      );
    }

    const farewellChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!farewellChannel || (farewellChannel.type != 'text' && farewellChannel.type != 'news') || !farewellChannel.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text or announcement channel or provide a valid text or announcement channel ID
      `);

    // Update status
    const status =  message.client.utils.getStatus(farewellChannel, farewellMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.client.db.settings.updateFarewellChannelId.run(farewellChannel.id, message.guild.id);
    message.channel.send(embed
      .spliceFields(0, 0, { name: 'Channel', value: `${oldFarewellChannel} ➔ ${farewellChannel}`, inline: true})
      .spliceFields(1, 0, { name: 'Status', value: statusUpdate, inline: true})
    );
  }
};
