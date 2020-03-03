const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownmessage',
      usage: '',
      description: 'Sets the message that Calypso will say during the crown role rotation.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    message.channel.send(oneLine`
      ${message.author}, I am now waiting for the new crown message. Your next message will be saved exactly as
      written. You may use \`?member\` to substitute for a user mention and \`?role\` to substitute for the crown role.
      You may enter \`clear\` to clear the current message. This will timeout after 1 minute.
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
        // Clear message
        if (content === 'clear') {
          message.client.db.guildSettings.updateCrownMessage.run(null, message.guild.id);
          return message.channel.send('Successfully **cleared** the `crown message`.');
        }
        message.client.db.guildSettings.updateCrownMessage.run(content, message.guild.id);
        message.channel.send(`${message.author}, I have updated the crown message to:`);
        message.channel.send(content);
      })
      .catch(() => message.channel.send(`${message.author}, operation has timed out. Please try again.`));
  }
};