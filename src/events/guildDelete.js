const { MessageEmbed } = require('discord.js');
const { fail } = require('../utils/emojis.json');

module.exports = (client, guild) => {

  client.logger.info(`Calypso has left ${guild.name}`);
  const serverLog = client.channels.cache.get(client.serverLogId);
  if (serverLog)
    serverLog.send(new MessageEmbed().setDescription(`${client.user} has left **${guild.name}** ${fail}`));

  client.db.settings.deleteGuild.run(guild.id);
  client.db.users.deleteGuild.run(guild.id);

  if (guild.job) guild.job.cancel(); // Cancel old job

};
