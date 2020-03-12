const Command = require('../Command.js');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'h'],
      usage: '',
      description: 'Displays a list of all current commands.',
      type: 'general'
    });
  }
  run(message) {
    const prefix = message.client.db.guildSettings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    let general = ['**General Commands**'];
    let fun = ['**Fun Commands**'];
    let point = ['**Point Commands**'];
    let mod = ['**Moderation Commands**'];
    let howto = ['**How-To Commands**'];
    let admin = ['**Admin Commands**'];
    message.client.commands.forEach(c => {
      if (c.type === 'general') general.push(`\`${prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else if (c.type === 'fun') fun.push(`\`${prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else if (c.type === 'point') point.push(`\`${prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else if (c.type === 'mod') mod.push(`\`${prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else if (c.type === 'howto') howto.push(`\`${prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else if (c.type === 'admin') admin.push(`\`${prefix}${c.name} ${c.usage}\` - *${c.description}*`);
    });
    general[0] = general[0] + ` **(${general.length - 1})**`;
    fun[0] = fun[0] + ` **(${fun.length - 1})**`;
    point[0] = point[0] + ` **(${point.length - 1})**`;
    mod[0] = mod[0] + ` **(${mod.length - 1})**`;
    howto[0] = howto[0] + ` **(${howto.length - 1})**`;
    admin[0] = admin[0] + ` **(${admin.length - 1})**`;
    message.channel.send(`:mailbox_with_mail: ${message.member}, I messaged you a list of commands.`);
    message.member.send(general.join('\n'));
    message.member.send(fun.join('\n'));
    message.member.send(point.join('\n'));
    message.member.send(mod.join('\n'));
    message.member.send(howto.join('\n'));
    message.member.send(admin.join('\n'));
  }
};
