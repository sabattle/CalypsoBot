module.exports = {
  name: 'color',
  usage: '<COLOR NAME>',
  description: 'Changes your current color to the one specified (members only).',
  tag: 'general',
  run: async (message, args) => {
    let colors = message.guild.roles.filter(c => c.name.indexOf('#') === 0);
    if (message.member.roles.find('name', 'Member')){ //role check
      let target = args.join(' ').toLowerCase();
      let color = colors.find(c => target.startsWith(c.name.slice(1).toLowerCase()) || target.startsWith(c.name.toLowerCase()));
      //args check
      if (!color) return message.channel.send(`Sorry ${message.member.displayName}, I don't recognize that color. Type \`!colors\` for a list.`);
      else if (message.member.roles.has(color.id)) return message.channel.send(`${message.member.displayName}, you are already ${color}!`);
      await message.member.removeRoles(colors);
      await message.member.addRole(color);
      message.channel.send(`${message.member.displayName}, you now have the color ${color}.`);
    }
    else message.channel.send(`${message.member.displayName}, you do not have permission to change your color!`);
  }
}
