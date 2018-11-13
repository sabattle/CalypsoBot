const Database = require('better-sqlite3');
const db = new Database(__basedir + '/data/db.sqlite');

module.exports = (client) => {

  // create table
  db.prepare('CREATE TABLE IF NOT EXISTS scores (id TEXT, guild TEXT, points INTEGER);').run();
  db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx ON scores (id, guild);').run();
  db.prepare('CREATE TABLE IF NOT EXISTS config (guild TEXT PRIMARY KEY, welcome TEXT, member TEXT, mod TEXT, crown TEXT);').run();
  db.pragma('synchronous = 1');
  db.pragma('journal_mode = wal');

  // prepare statements
  client.getScore = db.prepare('SELECT * FROM scores WHERE id = ? AND guild = ?');
  client.setScore = db.prepare('INSERT OR REPLACE INTO scores (id, guild, points) VALUES (@id, @guild, @points);');
  client.clearScore = db.prepare('UPDATE scores SET points = 0');
  client.getTop10 = db.prepare('SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;');
  client.getScoreboard = db.prepare('SELECT * FROM scores WHERE guild = ? ORDER BY points DESC;');
  client.getRow = db.prepare('SELECT * FROM config WHERE guild = ?');
  client.setRow = db.prepare('INSERT OR REPLACE INTO config (guild, welcome, member, mod, crown) VALUES (@guild, @welcome, @member, @mod, @crown);');

  console.log('Booted up successfully. Calypso is now online.');
  console.log(`Calypso is running on ${client.guilds.size} server(s).`);
  client.user.setPresence({ status: 'online', game: { name: 'your commands', type: 2 } });
};
