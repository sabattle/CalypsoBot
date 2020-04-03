const Command = require('../Command.js');
const { stripIndent } = require('common-tags');

module.exports = class HowToMuteRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'howtomuterole',
      aliases: ['h2muterole'],
      usage: '',
      description: 'Explains how to create a proper mute role on your server.',
      type: 'howto'
    });
  }
  run(message) {
    const prefix = message.client.db.guildSettings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    message.channel.send(stripIndent`
      Working with Discord role permissions can be tricky! To make a working mute role, here's what I recommend:

        1. Create a role without the ability to send messages or speak in voice chat. Place this role above most others.
        2. Within the server's text channel permissions, set the override for the role to disallow sending messages.
        3. Repeat the above step, but with the voice channel permission overrides.
      
      And that's it! To set the mute role, use the \`${prefix}setmuterole\` command.
      **Please Note**: Roles with overrides that allow sending messages will always take priorty.
    `);
  }
};
