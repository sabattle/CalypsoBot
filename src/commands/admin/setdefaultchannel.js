const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetDefaultChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setdefaultchannel',
      usage: '<CHANNEL MENTION>',
      description: 'Sets the default text channel for your server.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    const channel = this.getChannelFromMention(message, args[0]);
    if (!channel) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a text channel.
    `);
    message.client.db.guildSettings.updateDefaultChannelId.run(channel.id, message.guild.id);
    message.channel.send(`Successfully updated the default channel to ${channel}.`);
  }
};
