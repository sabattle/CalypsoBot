const Command = require('../Command.js');

module.exports = class OwnerHelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ownerhelp',
      aliases: ['ownercommands', 'oh'],
      usage: '',
      description: 'Displays a list of all current owner commands.',
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message) {
    const prefix = message.client.db.guildSettings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    let owner = ['**Owner Commands**'];
    message.client.commands.forEach(c => {
      if (c.type === 'owner') owner.push(`\`${prefix}${c.name} ${c.usage}\` - *${c.description}*`);
    });
    owner[0] = owner[0] + ` **(${owner.length - 1})**`;
    message.channel.send(`:mailbox_with_mail: ${message.member}, I messaged you a list of owner commands.`);
    message.member.send(owner.join('\n'));
  }
};
