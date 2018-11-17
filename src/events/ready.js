const Database = require('better-sqlite3');
const db = new Database(__basedir + '/data/db.sqlite');

module.exports = (client) => {

  // create tables
  db.prepare('CREATE TABLE IF NOT EXISTS scores (userID TEXT, guildID TEXT, points INTEGER, totalPoints INTEGER);').run();
  db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx ON scores (userID, guildID);').run();
  db.prepare('CREATE TABLE IF NOT EXISTS config (guildID TEXT PRIMARY KEY, defaultChannelID TEXT, memberRole TEXT, modRole TEXT, adminRole TEXT, crownRole TEXT, autoRole TEXT);').run();
  db.pragma('synchronous = 1');
  db.pragma('journal_mode = wal');

  // prepare statements
  client.getScore = db.prepare('SELECT * FROM scores WHERE userID = ? AND guildID = ?');
  client.setScore = db.prepare('INSERT OR REPLACE INTO scores (userID, guildID, points, totalPoints) VALUES (@userID, @guildID, @points, @totalPoints);');
  client.clearScore = db.prepare('UPDATE scores SET points = 0 WHERE guildID = ?');
  client.getTop10 = db.prepare('SELECT * FROM scores WHERE guildID = ? ORDER BY points DESC LIMIT 10;');
  client.getScoreboard = db.prepare('SELECT * FROM scores WHERE guildID = ? ORDER BY points DESC;');
  client.getRow = db.prepare('SELECT * FROM config WHERE guildID = ?');
  client.setRow = db.prepare('INSERT OR REPLACE INTO config (guildID, defaultChannelID, memberRole, modRole, adminRole, crownRole, autoRole) VALUES (@guildID, @defaultChannelID, @memberRole, @modRole, @adminRole, @crownRole, @autoRole);');

  console.log('Booted up successfully. Calypso is now online.');
  console.log(`Calypso is running on ${client.guilds.size} server(s).`);
  client.user.setPresence({ status: 'online', game: { name: 'your commands', type: 2 } });
};
