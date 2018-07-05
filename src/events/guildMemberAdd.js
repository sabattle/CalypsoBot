module.exports = (client, member) => {
  client.channels.get(client.defaultChannelID).send(`Welcome to ${member.guild.name}, ${member}! Here's what you need to know:
  » '${client.prefix}' is the prefix for my commands.
  » Type \`${client.prefix}help\` to get a list of everything I can do!
  » Commands don't work in DM. Sorry :cold_sweat:
  » Have fun!`);
}
