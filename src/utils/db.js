const Database = require('better-sqlite3');
const db = new Database(__basedir + '/data/db.sqlite');

// Set pragmas
db.pragma('synchronous = 1');

/**
 * Enabling WAL mode causes issues with file locking within WSL, works fine on a normal Unix system
 * Issue documented here: https://github.com/microsoft/WSL/issues/2395
 */
// db.pragma('journal_mode = wal');

/** ------------------------------------------------------------------------------------------------
 * TABLES
 * ------------------------------------------------------------------------------------------------ */
// GUILD SETTINGS
db.prepare(`
  CREATE TABLE IF NOT EXISTS settings (
    guild_id TEXT PRIMARY KEY,
    guild_name TEXT,
    prefix TEXT NOT NULL,
    default_channel_id TEXT,
    modlog_channel_id TEXT, 
    welcome_channel_id TEXT,
    leave_channel_id TEXT,
    admin_role_id TEXT,
    mod_role_id TEXT,
    mute_role_id TEXT,
    auto_role_id TEXT,
    crown_role_id TEXT,
    message_points INTEGER NOT NULL,
    command_points INTEGER NOT NULL,
    voice_points INTEGER NOT NULL, 
    welcome_message TEXT,
    leave_message TEXT,
    crown_message TEXT,
    crown_schedule TEXT,
    disabled_types TEXT,
    disabled_commands TEXT
);`).run();

// GUILD POINTS
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT,
    user_name TEXT,
    guild_id TEXT,
    guild_name TEXT,
    points INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    PRIMARY KEY (user_id, guild_id)
);`).run();

/** ------------------------------------------------------------------------------------------------
 * PREPARED STATEMENTS
 * ------------------------------------------------------------------------------------------------ */
// GUILD SETTINGS
const settings = {
  insertRow: db.prepare(`
    INSERT OR IGNORE INTO settings (
      guild_id, 
      guild_name,
      prefix, 
      default_channel_id, 
      message_points,
      command_points,
      voice_points
    ) VALUES (?, ?, '!', ?, 1, 1, 1);
  `),
  selectRow: db.prepare('SELECT * FROM settings WHERE guild_id = ?;'),
  selectPrefix: db.prepare('SELECT prefix FROM settings WHERE guild_id = ?;'),
  updatePrefix: db.prepare('UPDATE settings SET prefix = ? WHERE guild_id = ?;'),
  selectDefaultChannelId: db.prepare('SELECT default_channel_id FROM settings WHERE guild_id = ?;'),
  updateDefaultChannelId: db.prepare('UPDATE settings SET default_channel_id = ? WHERE guild_id = ?;'),
  selectModlogChannelId: db.prepare('SELECT modlog_channel_id FROM settings WHERE guild_id = ?;'),
  updateModlogChannelId: db.prepare('UPDATE settings SET modlog_channel_id = ? WHERE guild_id = ?;'),
  selectWelcomeChannelId: db.prepare('SELECT welcome_channel_id FROM settings WHERE guild_id = ?;'),
  updateWelcomeChannelId: db.prepare('UPDATE settings SET welcome_channel_id = ? WHERE guild_id = ?;'),
  selectLeaveChannelId: db.prepare('SELECT leave_channel_id FROM settings WHERE guild_id = ?;'),
  updateLeaveChannelId: db.prepare('UPDATE settings SET leave_channel_id = ? WHERE guild_id = ?;'),
  selectAdminRoleId: db.prepare('SELECT admin_role_id FROM settings WHERE guild_id = ?;'),
  updateAdminRoleId: db.prepare('UPDATE settings SET admin_role_id = ? WHERE guild_id = ?;'),
  selectModRoleId: db.prepare('SELECT mod_role_id FROM settings WHERE guild_id = ?;'),
  updateModRoleId: db.prepare('UPDATE settings SET mod_role_id = ? WHERE guild_id = ?;'),
  selectMuteRoleId: db.prepare('SELECT mute_role_id FROM settings WHERE guild_id = ?;'),
  updateMuteRoleId: db.prepare('UPDATE settings SET mute_role_id = ? WHERE guild_id = ?;'),
  selectAutoRoleId: db.prepare('SELECT auto_role_id FROM settings WHERE guild_id = ?;'),
  updateAutoRoleId: db.prepare('UPDATE settings SET auto_role_id = ? WHERE guild_id = ?;'),
  selectCrownRoleId: db.prepare('SELECT crown_role_id FROM settings WHERE guild_id = ?;'),
  updateCrownRoleId: db.prepare('UPDATE settings SET crown_role_id = ? WHERE guild_id = ?;'),
  selectMessagePoints: db.prepare('SELECT message_points FROM settings WHERE guild_id = ?;'),
  updateMessagePoints: db.prepare('UPDATE settings SET message_points = ? WHERE guild_id = ?;'),
  selectCommandPoints: db.prepare('SELECT command_points FROM settings WHERE guild_id = ?;'),
  updateCommandPoints: db.prepare('UPDATE settings SET command_points = ? WHERE guild_id = ?;'),
  selectVoicePoints: db.prepare('SELECT voice_points FROM settings WHERE guild_id = ?;'),
  updateVoicePoints: db.prepare('UPDATE settings SET voice_points = ? WHERE guild_id = ?;'),
  selectWelcomeMessage: db.prepare('SELECT welcome_message FROM settings WHERE guild_id = ?;'),
  updateWelcomeMessage: db.prepare('UPDATE settings SET welcome_message = ? WHERE guild_id = ?;'),
  selectLeaveMessage: db.prepare('SELECT leave_message FROM settings WHERE guild_id = ?;'),
  updateLeaveMessage: db.prepare('UPDATE settings SET leave_message = ? WHERE guild_id = ?;'),
  selectCrownMessage: db.prepare('SELECT crown_message FROM settings WHERE guild_id = ?;'),
  updateCrownMessage: db.prepare('UPDATE settings SET crown_message = ? WHERE guild_id = ?;'),
  selectCrownSchedule: db.prepare('SELECT crown_schedule FROM settings WHERE guild_id = ?;'),
  updateCrownSchedule: db.prepare('UPDATE settings SET crown_schedule = ? WHERE guild_id = ?;'),
  selectDisabledTypes: db.prepare('SELECT disabled_types FROM settings WHERE guild_id = ?;'),
  updateDisabledTypes: db.prepare('UPDATE settings SET disabled_types = ? WHERE guild_id = ?;'),
  selectDisabledCommands: db.prepare('SELECT disabled_commands FROM settings WHERE guild_id = ?;'),
  updateDisabledCommands: db.prepare('UPDATE settings SET disabled_commands = ? WHERE guild_id = ?;')
};

// GUILD POINTS
const users = {
  insertRow: db.prepare(`
    INSERT OR IGNORE INTO users (
      user_id, 
      user_name,
      guild_id, 
      guild_name, 
      points,
      total_points
    ) VALUES (?, ?, ?, ?, 0, 0);
  `),
  selectRow: db.prepare('SELECT * FROM users WHERE user_id = ? AND guild_id = ?;'),
  selectUserIds: db.prepare('SELECT user_id FROM users WHERE guild_id = ?;'),
  selectUserName: db.prepare('SELECT user_name FROM users WHERE user_id = ? AND guild_id = ?;'),
  selectLeaderboard: db.prepare('SELECT * FROM users WHERE guild_id = ? ORDER BY points DESC;'),
  selectPoints: db.prepare('SELECT points FROM users WHERE user_id = ? AND guild_id = ?;'),
  updatePoints: db.prepare(`
    UPDATE users 
    SET points = points + @points, total_points = total_points + @points
    WHERE user_id = ? AND guild_id = ?;
  `),
  selectTotalPoints: db.prepare('SELECT total_points FROM users WHERE user_id = ? AND guild_id = ?;'),
  wipeServerPoints: db.prepare('UPDATE users SET points = 0 WHERE guild_id = ?;'),
  wipeAllServerPoints: db.prepare('UPDATE users SET points = 0, total_points = 0 WHERE guild_id = ?;'),
  wipePoints: db.prepare('UPDATE users SET points = 0 WHERE user_id = ? AND guild_id = ?;'),
  wipeAllPoints: db.prepare('UPDATE users SET points = 0, total_points = 0 WHERE user_id = ? AND guild_id = ?;'),
  deleteRow: db.prepare('DELETE FROM users WHERE user_id = ? AND guild_id = ?;')
};

module.exports = {
  settings,
  users
};