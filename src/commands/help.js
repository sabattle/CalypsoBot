module.exports = {
  name: 'help',
  usage: '',
  description: 'Displays a list of all current commands.',
  tag: 'general',
  run: (message, args) => {
    let general = ['**General Commands**'];
    let fun = ['**Fun Commands**'];
    let admin = ['**Admin Commands**'];
    message.client.commands.forEach(c => {
      if (c.tag === 'general') general.push(`\`${message.client.prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else if (c.tag === 'fun') fun.push(`\`${message.client.prefix}${c.name} ${c.usage}\` - *${c.description}*`);
      else admin.push(`\`${message.client.prefix}${c.name} ${c.usage}\` - *${c.description}*`);
    });
    general[0] = general[0] + ` **(${general.length - 1})**`;
    fun[0] = fun[0] + ` **(${fun.length - 1})**`;
    admin[0] = admin[0] + ` **(${admin.length - 1})**`;
    message.channel.send(`:mailbox_with_mail: ${message.member}, I messaged you a list of commands.`);
    message.member.send(general.join('\n') + '\n\n' + fun.join('\n') + '\n\n' + admin.join('\n'));
  }
}
