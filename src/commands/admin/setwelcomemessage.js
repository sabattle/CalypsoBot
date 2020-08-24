const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setwelcomemessage',
      aliases: ['setwm', 'swm'],
      usage: 'setwelcomemessage <message>',
      description: oneLine`
        Sets the message Calypso will say when someone joins your server.
        You may use \`?member\` to substitute for a user mention.
        Enter no message to clear the current \`welcome message\`.
        A \`welcome channel\` must also be set to enable welcome messages.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setwelcomemessage ?member has joined the server!']
    });
  }
  run(message, args) {

    const { welcome_channel_id: welcomeChannelId, welcome_message: oldWelcomeMessage } = 
      message.client.db.settings.selectWelcomeMessages.get(message.guild.id);
    let welcomeChannel = message.guild.channels.cache.get(welcomeChannelId);

    // Get status
    const oldStatus = message.client.utils.getStatus(welcomeChannelId, oldWelcomeMessage);

    const embed = new MessageEmbed()
      .setTitle('Settings: `Welcome Messages`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`welcome message\` was successfully updated. ${success}`)
      .addField('Channel', welcomeChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateWelcomeMessage.run(null, message.guild.id);

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send(embed
        .addField('Status', statusUpdate, true)
        .addField('Message', '`None`')
      );
    }
    
    let welcomeMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateWelcomeMessage.run(welcomeMessage, message.guild.id);
    if (welcomeMessage.length >= 1018) welcomeMessage = welcomeMessage.slice(0, 1015) + '...';

    // Update status
    const status =  message.client.utils.getStatus(welcomeChannel, welcomeMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send(embed
      .addField('Status', statusUpdate, true)
      .addField('Message', `\`\`\`${welcomeMessage}\`\`\``)
    );
  }
};