const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setwelcomemessage',
      usage: '',
      description: 'Sets the message that Calypso will say when someone joins your server.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    message.channel.send(oneLine`
      ${message.author}, I am now waiting for the new welcome message. Your next message will be saved exactly as
      written. You may use \`?member\` to substitute for a user mention. This will timeout after 1 minute.
    `);
    const prefix = message.client.db.guildSettings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    message.channel.awaitMessages(m => {
      let command, alias;
      if (m.content.startsWith(prefix)){
        const args = m.content.trim().split(/ +/g);
        const cmd = args.shift().slice(prefix.length).toLowerCase();
        command = message.client.commands.get(cmd);
        alias = message.client.aliases.get(cmd);
      }
      if (m.author == message.author && !command && !alias) return true;
    }, { maxMatches: 1, time: 60000 }) // One minute timer
      .then(messages => {
        const content = messages.first().content;
        message.client.db.guildSettings.updateWelcomeMessage.run(content, message.guild.id);
        message.channel.send(`${message.author}, I have updated the \`welcome message\` to:`);
        message.channel.send(content);
      })
      .catch(() => message.channel.send(`${message.author}, operation has timed out. Please try again.`));
  }
};