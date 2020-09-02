const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetFarewellMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setfarewellmessage',
      aliases: ['setfarewellmsg', 'setfm', 'sfm'],
      usage: 'setfarewellmessage <message>',
      description: oneLine`
        Sets the message Calypso will say when someone leaves your server.
        You may use \`?member\` to substitute for a user mention,
        \`?username\` to substitute for someone's username,
        \`?tag\` to substitute for someone's full Discord tag (username + discriminator),
        and \`?size\` to substitute for your server's current member count.
        Enter no message to clear the current \`farewell message\`.
        A \`farewell channel\` must also be set to enable farewell messages.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setfarewellmessage ?member has left the server.']
    });
  }
  run(message, args) {

    const { farewell_channel_id: farewellChannelId, farewell_message: oldFarewellMessage } = 
      message.client.db.settings.selectFarewells.get(message.guild.id);
    const farewellChannel = message.guild.channels.cache.get(farewellChannelId);
    
    // Get status
    const oldStatus = message.client.utils.getStatus(farewellChannelId, oldFarewellMessage);

    const embed = new MessageEmbed()
      .setTitle('Settings: `Farewells`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`farewell message\` was successfully updated. ${success}`)
      .addField('Channel', farewellChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateFarewellMessage.run(null, message.guild.id);

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send(embed
        .addField('Status', statusUpdate, true)
        .addField('Message', '`None`')
      );
    }
    
    let farewellMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateFarewellMessage.run(farewellMessage, message.guild.id);
    if (farewellMessage.length > 1024) farewellMessage = farewellMessage.slice(0, 1021) + '...';

    // Update status
    const status =  message.client.utils.getStatus(farewellChannel, farewellMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;
    
    message.channel.send(embed
      .addField('Status', statusUpdate, true)
      .addField('Message', message.client.utils.replaceKeywords(farewellMessage))
    );
  }
};