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
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setwelcomemessage ?member has joined the server!']
    });
  }
  run(message, args) {
    const oldWelcomeMessage = message.client.db.settings.selectWelcomeMessage.pluck().get(message.guild.id);
    const status = (oldWelcomeMessage) ? '`enabled`' : '`disabled`';
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `welcome message` was successfully updated.')
      .addField('Setting', 'Welcome Message', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (!message.content.includes(' ')) {
      message.client.db.settings.updateWelcomeMessage.run(null, message.guild.id);
      return message.channel.send(embed
        .addField('Current Status', `${status} ➔ \`disabled\``, true)
        .addField('New Message', '`None`')
      );
    }
    let welcomeMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateWelcomeMessage.run(welcomeMessage, message.guild.id);
    if (welcomeMessage.length > 1024) welcomeMessage = welcomeMessage.slice(1021) + '...';
    message.channel.send(embed
      .addField('Current Status', `${status} ➔ \`enabled\``, true)
      .addField('New Message', welcomeMessage)
    );
  }
};