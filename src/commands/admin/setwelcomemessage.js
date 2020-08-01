const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
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
        Enter no message to clear the current welcome message.
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
    let status, oldStatus = (welcomeChannelId && oldWelcomeMessage) ? '`enabled`' : '`disabled`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Welcome Messages`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `welcome message` was successfully updated. <:success:736449240728993802>')
      .addField('Channel', welcomeChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateWelcomeMessage.run(null, message.guild.id);

      // Check status
      if (oldStatus != '`disabled`') status = '`enabled` ➔ `disabled`'; 
      else status = '`disabled`';

      return message.channel.send(embed
        .addField('Status', status, true)
        .addField('Message', '`None`')
      );
    }
    
    let welcomeMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateWelcomeMessage.run(welcomeMessage, message.guild.id);
    if (welcomeMessage.length >= 1018) welcomeMessage = welcomeMessage.slice(0, 1015) + '...';

    // Check status
    if (oldStatus != '`enabled`' && welcomeChannel && welcomeMessage) status =  '`disabled` ➔ `enabled`';
    else status = oldStatus;

    message.channel.send(embed
      .addField('Status', status, true)
      .addField('Message', `\`\`\`${welcomeMessage}\`\`\``)
    );
  }
};