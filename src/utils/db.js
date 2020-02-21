const Database = require('better-sqlite3');
const db = new Database(__basedir + '/data/db.sqlite');

// Set pragmas
db.pragma('synchronous = 1');

/**
 * Enabling WAL mode causes issues with file locking within WSL, works fine on a normal Unix system
 * Issue documented here: https://github.com/microsoft/WSL/issues/2395
 */
// db.pragma('journal_mode = wal');

// Create guild settings table
db.prepare(`
  CREATE TABLE IF NOT EXISTS guild_settings (
  guild_id TEXT PRIMARY KEY,
  guild_name TEXT,
  default_channel_id TEXT, 
  admin_role_id TEXT,
  mod_role_id TEXT,
  auto_role_id TEXT,
  use_welcome_message INTEGER,
  welcome_message TEXT,
  use_leave_message INTEGER,
  leave_message TEXT,
  UNIQUE(guild_id)
);`).run();

const guildSettings = {
  insertRow: db.prepare(`
    INSERT OR IGNORE INTO guild_settings (
      guild_id, 
      guild_name, 
      default_channel_id, 
      use_welcome_message, 
      use_leave_message
    ) VALUES (?, ?, ?, 0, 0);
  `),
  updateDefaultChannelId: db.prepare('UPDATE guild_settings SET default_channel_id = ? WHERE guild_id = ?;'),
  updateAdminRoleId: db.prepare('UPDATE guild_settings SET admin_role_id = ? WHERE guild_id = ?;'),
  updateModRoleId: db.prepare('UPDATE guild_settings SET mod_role_id = ? WHERE guild_id = ?;'),
  updateAutoRoleId: db.prepare('UPDATE guild_settings SET auto_role_id = ? WHERE guild_id = ?;'),
  updateUseWelcomeMessage: db.prepare('UPDATE guild_settings SET use_welcome_message = ? WHERE guild_id = ?;'),
  updateWelcomeMessage: db.prepare('UPDATE guild_settings SET welcome_message = ? WHERE guild_id = ?;'),
  updateUseLeaveMessage: db.prepare('UPDATE guild_settings SET use_leave_message = ? WHERE guild_id = ?;'),
  updateLeaveMessage: db.prepare('UPDATE guild_settings SET leave_message = ? WHERE guild_id = ?;')
};

module.exports = {
  guildSettings
};