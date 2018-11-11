module.exports = {
  name: 'colors',
  usage: '',
  description: 'Displays a list of all available colors.',
  tag: 'general',
  run: (message, args) => {
    let colors = message.guild.roles.filter(c => c.name.indexOf('#') === 0);
    if (colors.size === 0) return message.channel.send(`Sorry ${message.member.displayName}, I couldn't find any colors on this server.`);
    colors = colors.array().sort((r1, r2) => (r1.position !== r2.position) ? r1.position - r2.position : r1.id - r2.id).reverse().join(' ');
    message.channel.send(`Here are all of the colors I found:\n\n${colors}\n\nType \`!color <COLOR NAME>\` to choose one.`);
  }
}
