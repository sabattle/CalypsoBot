const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetModlogChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodlogchannel',
      aliases: ['setmlc', 'smlc'],
      usage: '<CHANNEL MENTION>',
      description: 'Sets the modlog channel for your server (provide no channel to clear).',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.guildSettings.updateModlogChannelId.run(null, message.guild.id);
      return message.channel.send('Successfully **cleared** the `modlog channel`.');
    }     
    const channel = this.getChannelFromMention(message, args[0]);
    if (!channel) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a text channel.
    `);
    message.client.db.guildSettings.updateModlogChannelId.run(channel.id, message.guild.id);
    message.channel.send(`Successfully updated the \`modlog channel\` to ${channel}.`);
  }
};
