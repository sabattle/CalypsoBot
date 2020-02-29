const Command = require('../Command.js');

module.exports = class GitHubCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'github',
      aliases: ['gh', 'repo'],
      usage: '',
      description: 'Posts the link to Calypso\'s GitHub repository.',
      type: 'general'
    });
  }
  run(message) {
    message.channel.send(`
      Here's the link to my GitHub repository:
      <https://github.com/sabattle/Calypso>

      Please support me by starring the repo, and feel free to comment about issues or suggestions!
    `);
  }
};
