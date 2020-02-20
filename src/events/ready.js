module.exports = (client) => {
  client.logger.info('Calypso is now online');
  client.logger.info(`Calypso is running on ${client.guilds.size} server(s)`);
  client.user.setPresence({ status: 'online', game: { name: 'your commands', type: 2 } });
};
