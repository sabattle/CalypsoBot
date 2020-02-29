const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetDefaultChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setdefaultchannel',
      usage: '<TEXT CHANNEL>',
      description: 'Sets the default text channel for your server.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    const target = message.mentions.channels.first();
    if (!target) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a text channel.
    `);
    message.client.db.guildSettings.updateDefaultChannelId.run(target.id, message.guild.id);
    message.channel.send(`Successfully updated the default channel to ${target}.`);
  }
};
