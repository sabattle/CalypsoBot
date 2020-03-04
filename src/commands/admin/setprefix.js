const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetPrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setprefix',
      aliases: ['setp', 'sp'],
      usage: '<PREFIX>',
      description: 'Sets the command prefix for your server (max length of 3 characters).',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    const prefix = args[0];
    if (!prefix || prefix.length > 3) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please ensure the prefix is no larger than 3 characters.
    `);
    message.client.db.guildSettings.updatePrefix.run(prefix, message.guild.id);
    message.channel.send(`Successfully updated the prefix to \`${prefix}\`.`);
  }
};
