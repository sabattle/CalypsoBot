const Command = require('../Command.js');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands'],
      usage: '',
      description: 'Displays a list of all current commands.',
      type: 'general'
    });
  }
  run(message) {
    let general = ['**General Commands**'];
    let fun = ['**Fun Commands**'];
    let mod = ['**Moderation Commands**'];
    let admin = ['**Admin Commands**'];
    message.client.commands.forEach(c => {
      if (c.type === 'general') general.push(`\`${message.client.prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else if (c.type === 'fun') fun.push(`\`${message.client.prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else if (c.type === 'mod') mod.push(`\`${message.client.prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else if (c.type === 'admin') mod.push(`\`${message.client.prefix}${c.name} ${c.usage}\` - *${c.description}*`);
    });
    general[0] = general[0] + ` **(${general.length - 1})**`;
    fun[0] = fun[0] + ` **(${fun.length - 1})**`;
    mod[0] = mod[0] + ` **(${mod.length - 1})**`;
    admin[0] = admin[0] + ` **(${admin.length - 1})**`;
    message.channel.send(`:mailbox_with_mail: ${message.member}, I messaged you a list of commands.`);
    message.member.send(general.join('\n'));
    message.member.send(fun.join('\n'));
    message.member.send(mod.join('\n'));
    message.member.send(admin.join('\n'));
  }
};
