module.exports = (client) => {
  console.log(`Booted up successfully. Calypso is now online.`);
  client.user.setPresence({ status: 'online', game: { name: 'your commands', type: 2 } });
}
