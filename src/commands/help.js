module.exports = {
  name: 'help',
  usage: '',
  description: 'Displays a list of all current commands.',
  tag: 'general',
  run: (message) => {
    let general = ['**General Commands**'];
    let fun = ['**Fun Commands**'];
    let mod = ['**Moderator Commands**'];
    message.client.commands.forEach(c => {
      if (c.tag === 'general') general.push(`\`${message.client.prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else if (c.tag === 'fun') fun.push(`\`${message.client.prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else mod.push(`\`${message.client.prefix}${c.name} ${c.usage}\` - *${c.description}*`);
    });
    general[0] = general[0] + ` **(${general.length - 1})**`;
    fun[0] = fun[0] + ` **(${fun.length - 1})**`;
    mod[0] = mod[0] + ` **(${mod.length - 1})**`;
    message.channel.send(`:mailbox_with_mail: ${message.member}, I messaged you a list of commands.`);
    message.member.send(general.join('\n'));
    message.member.send(fun.join('\n'));
    message.member.send(mod.join('\n'));
  }
};
