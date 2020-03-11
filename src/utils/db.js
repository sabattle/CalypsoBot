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
  CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id TEXT PRIMARY KEY,
    guild_name TEXT,
    prefix TEXT NOT NULL,
    default_channel_id TEXT,
    modlog_channel_id TEXT, 
    admin_role_id TEXT,
    mod_role_id TEXT,
    mute_role_id TEXT,
    auto_role_id TEXT,
    crown_role_id TEXT,
    use_points INTEGER NOT NULL,
    use_voice_points INTEGER NOT NULL,
    welcome_message TEXT,
    leave_message TEXT,
    crown_message TEXT,
    crown_schedule TEXT
);`).run();

// GUILD POINTS
db.prepare(`
  CREATE TABLE IF NOT EXISTS guild_points (
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
const guildSettings = {
  insertRow: db.prepare(`
    INSERT OR IGNORE INTO guild_settings (
      guild_id, 
      guild_name,
      prefix, 
      default_channel_id, 
      use_points,
      use_voice_points
    ) VALUES (?, ?, '!', ?, 1, 1);
  `),
  selectRow: db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?;'),
  selectPrefix: db.prepare('SELECT prefix FROM guild_settings WHERE guild_id = ?;'),
  updatePrefix: db.prepare('UPDATE guild_settings SET prefix = ? WHERE guild_id = ?;'),
  selectDefaultChannelId: db.prepare('SELECT default_channel_id FROM guild_settings WHERE guild_id = ?;'),
  updateDefaultChannelId: db.prepare('UPDATE guild_settings SET default_channel_id = ? WHERE guild_id = ?;'),
  selectModlogChannelId: db.prepare('SELECT modlog_channel_id FROM guild_settings WHERE guild_id = ?;'),
  updateModlogChannelId: db.prepare('UPDATE guild_settings SET modlog_channel_id = ? WHERE guild_id = ?;'),
  selectAdminRoleId: db.prepare('SELECT admin_role_id FROM guild_settings WHERE guild_id = ?;'),
  updateAdminRoleId: db.prepare('UPDATE guild_settings SET admin_role_id = ? WHERE guild_id = ?;'),
  selectModRoleId: db.prepare('SELECT mod_role_id FROM guild_settings WHERE guild_id = ?;'),
  updateModRoleId: db.prepare('UPDATE guild_settings SET mod_role_id = ? WHERE guild_id = ?;'),
  selectMuteRoleId: db.prepare('SELECT mute_role_id FROM guild_settings WHERE guild_id = ?;'),
  updateMuteRoleId: db.prepare('UPDATE guild_settings SET mute_role_id = ? WHERE guild_id = ?;'),
  selectAutoRoleId: db.prepare('SELECT auto_role_id FROM guild_settings WHERE guild_id = ?;'),
  updateAutoRoleId: db.prepare('UPDATE guild_settings SET auto_role_id = ? WHERE guild_id = ?;'),
  selectCrownRoleId: db.prepare('SELECT crown_role_id FROM guild_settings WHERE guild_id = ?;'),
  updateCrownRoleId: db.prepare('UPDATE guild_settings SET crown_role_id = ? WHERE guild_id = ?;'),
  selectUsePoints: db.prepare('SELECT use_points FROM guild_settings WHERE guild_id = ?;'),
  updateUsePoints: db.prepare('UPDATE guild_settings SET use_points = ? WHERE guild_id = ?;'),
  selectUseVoicePoints: db.prepare('SELECT use_voice_points FROM guild_settings WHERE guild_id = ?;'),
  updateUseVoicePoints: db.prepare('UPDATE guild_settings SET use_voice_points = ? WHERE guild_id = ?;'),
  selectWelcomeMessage: db.prepare('SELECT welcome_message FROM guild_settings WHERE guild_id = ?;'),
  updateWelcomeMessage: db.prepare('UPDATE guild_settings SET welcome_message = ? WHERE guild_id = ?;'),
  selectLeaveMessage: db.prepare('SELECT leave_message FROM guild_settings WHERE guild_id = ?;'),
  updateLeaveMessage: db.prepare('UPDATE guild_settings SET leave_message = ? WHERE guild_id = ?;'),
  selectCrownMessage: db.prepare('SELECT crown_message FROM guild_settings WHERE guild_id = ?;'),
  updateCrownMessage: db.prepare('UPDATE guild_settings SET crown_message = ? WHERE guild_id = ?;'),
  selectCrownSchedule: db.prepare('SELECT crown_schedule FROM guild_settings WHERE guild_id = ?;'),
  updateCrownSchedule: db.prepare('UPDATE guild_settings SET crown_schedule = ? WHERE guild_id = ?;')
};

// GUILD POINTS
const guildPoints = {
  insertRow: db.prepare(`
    INSERT OR IGNORE INTO guild_points (
      user_id, 
      user_name,
      guild_id, 
      guild_name, 
      points,
      total_points
    ) VALUES (?, ?, ?, ?, 0, 0);
  `),
  selectRow: db.prepare('SELECT * FROM guild_points WHERE user_id = ? AND guild_id = ?;'),
  selectLeaderboard: db.prepare('SELECT * FROM guild_points WHERE guild_id = ? ORDER BY points DESC;'),
  selectPoints: db.prepare('SELECT points FROM guild_points WHERE user_id = ? AND guild_id = ?;'),
  updatePoints: db.prepare(`
    UPDATE guild_points 
    SET points = points + @points, total_points = total_points + @points
    WHERE user_id = ? AND guild_id = ?;
  `),
  selectTotalPoints: db.prepare('SELECT total_points FROM guild_points WHERE user_id = ? AND guild_id = ?;'),
  clearPoints: db.prepare('UPDATE guild_points SET points = 0 WHERE guild_id = ?;'),
  wipePoints: db.prepare('UPDATE guild_points SET points = 0 WHERE user_id = ? AND guild_id = ?;'),
  wipeAllPoints: db.prepare('UPDATE guild_points SET points = 0, total_points = 0 WHERE user_id = ? AND guild_id = ?;')
};

module.exports = {
  guildSettings,
  guildPoints
};