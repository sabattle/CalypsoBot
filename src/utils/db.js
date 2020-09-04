const Database = require('better-sqlite3');
const db = new Database(__basedir + '/data/db.sqlite');

// Set pragmas
db.pragma('synchronous = 1');

/**
 * Enabling WAL mode causes issues with file locking within WSL, works fine on a normal Unix system
 * Issue documented here: https://github.com/microsoft/WSL/issues/2395
 */
db.pragma('journal_mode = wal');

/** ------------------------------------------------------------------------------------------------
 * TABLES
 * ------------------------------------------------------------------------------------------------ */
// BOT SETTINGS TABLE
db.prepare(`
  CREATE TABLE IF NOT EXISTS settings (
    guild_id TEXT PRIMARY KEY,
    guild_name TEXT,
    prefix TEXT DEFAULT "c!" NOT NULL,
    system_channel_id TEXT,
    starboard_channel_id TEXT,
    admin_role_id TEXT,
    mod_role_id TEXT,
    mute_role_id TEXT,
    auto_role_id TEXT,
    auto_kick INTEGER,
    random_color INTEGER DEFAULT 0 NOT NULL,
    mod_channel_ids TEXT,
    disabled_commands TEXT,
    mod_log_id TEXT,
    member_log_id TEXT,
    nickname_log_id TEXT,
    role_log_id TEXT,
    message_edit_log_id TEXT,
    message_delete_log_id TEXT,
    verification_role_id TEXT,
    verification_channel_id TEXT,
    verification_message TEXT,
    verification_message_id TEXT,
    welcome_channel_id TEXT,
    welcome_message TEXT,
    farewell_channel_id TEXT,
    farewell_message TEXT,
    point_tracking INTEGER DEFAULT 1 NOT NULL,
    message_points INTEGER DEFAULT 1 NOT NULL,
    command_points INTEGER DEFAULT 1 NOT NULL,
    voice_points INTEGER DEFAULT 1 NOT NULL, 
    crown_role_id TEXT,
    crown_channel_id TEXT,
    crown_message TEXT DEFAULT "?member has won ?role this week! Points have been reset, better luck next time!",
    crown_schedule TEXT DEFAULT "0 21 * * 5"
  );
`).run();

// USERS TABLE
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT,
    user_name TEXT,
    user_discriminator TEXT,
    guild_id TEXT,
    guild_name TEXT,
    date_joined TEXT,
    bot INTEGER,
    points INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    warns TEXT,
    current_member INTEGER NOT NULL,
    PRIMARY KEY (user_id, guild_id)
  );
`).run();

/** ------------------------------------------------------------------------------------------------
 * PREPARED STATEMENTS
 * ------------------------------------------------------------------------------------------------ */
// BOT SETTINGS TABLE
const settings = {
  insertRow: db.prepare(`
    INSERT OR IGNORE INTO settings (
      guild_id,
      guild_name,
      system_channel_id,
      welcome_channel_id,
      farewell_channel_id,
      crown_channel_id,
      mod_log_id,
      admin_role_id,
      mod_role_id,
      mute_role_id,
      crown_role_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `),

  // Selects
  selectRow: db.prepare('SELECT * FROM settings WHERE guild_id = ?;'),
  selectGuilds: db.prepare('SELECT guild_name, guild_id FROM settings'),
  selectPrefix: db.prepare('SELECT prefix FROM settings WHERE guild_id = ?;'),
  selectSystemChannelId: db.prepare('SELECT system_channel_id FROM settings WHERE guild_id = ?;'),
  selectStarboardChannelId: db.prepare('SELECT starboard_channel_id FROM settings WHERE guild_id = ?;'),
  selectAdminRoleId: db.prepare('SELECT admin_role_id FROM settings WHERE guild_id = ?;'),
  selectModRoleId: db.prepare('SELECT mod_role_id FROM settings WHERE guild_id = ?;'),
  selectMuteRoleId: db.prepare('SELECT mute_role_id FROM settings WHERE guild_id = ?;'),
  selectAutoRoleId: db.prepare('SELECT auto_role_id FROM settings WHERE guild_id = ?;'),
  selectAutoKick: db.prepare('SELECT auto_kick FROM settings WHERE guild_id = ?;'),
  selectRandomColor: db.prepare('SELECT random_color FROM settings WHERE guild_id = ?;'),
  selectModChannelIds: db.prepare('SELECT mod_channel_ids FROM settings WHERE guild_id = ?;'),
  selectDisabledCommands: db.prepare('SELECT disabled_commands FROM settings WHERE guild_id = ?;'),
  selectModLogId: db.prepare('SELECT mod_log_id FROM settings WHERE guild_id = ?;'),
  selectMemberLogId: db.prepare('SELECT member_log_id FROM settings WHERE guild_id = ?;'),
  selectNicknameLogId: db.prepare('SELECT nickname_log_id FROM settings WHERE guild_id = ?;'),
  selectRoleLogId: db.prepare('SELECT role_log_id FROM settings WHERE guild_id = ?;'),
  selectMessageEditLogId: db.prepare('SELECT message_edit_log_id FROM settings WHERE guild_id = ?;'),
  selectMessageDeleteLogId: db.prepare('SELECT message_delete_log_id FROM settings WHERE guild_id = ?;'),
  selectVerification: db.prepare(`
    SELECT verification_role_id, verification_channel_id, verification_message, verification_message_id 
    FROM settings
    WHERE guild_id = ?;
  `),
  selectWelcomes: db.prepare('SELECT welcome_channel_id, welcome_message FROM settings WHERE guild_id = ?;'),
  selectFarewells: db.prepare('SELECT farewell_channel_id, farewell_message FROM settings WHERE guild_id = ?;'),
  selectPoints: db.prepare(`
    SELECT point_tracking, message_points, command_points, voice_points
    FROM settings
    WHERE guild_id = ?;
  `),
  selectCrown: db.prepare(`
    SELECT crown_role_id, crown_channel_id, crown_message, crown_schedule
    FROM settings
    WHERE guild_id = ?;
  `),

  // Updates
  updatePrefix: db.prepare('UPDATE settings SET prefix = ? WHERE guild_id = ?;'),
  updateGuildName: db.prepare('UPDATE settings SET guild_name = ? WHERE guild_id = ?;'),
  updateSystemChannelId: db.prepare('UPDATE settings SET system_channel_id = ? WHERE guild_id = ?;'),
  updateStarboardChannelId: db.prepare('UPDATE settings SET starboard_channel_id = ? WHERE guild_id = ?;'),
  updateAdminRoleId: db.prepare('UPDATE settings SET admin_role_id = ? WHERE guild_id = ?;'),
  updateModRoleId: db.prepare('UPDATE settings SET mod_role_id = ? WHERE guild_id = ?;'),
  updateMuteRoleId: db.prepare('UPDATE settings SET mute_role_id = ? WHERE guild_id = ?;'),
  updateAutoRoleId: db.prepare('UPDATE settings SET auto_role_id = ? WHERE guild_id = ?;'),
  updateAutoKick: db.prepare('UPDATE settings SET auto_kick = ? WHERE guild_id = ?;'),
  updateRandomColor: db.prepare('UPDATE settings SET random_color = ? WHERE guild_id = ?;'),
  updateModChannelIds: db.prepare('UPDATE settings SET mod_channel_ids = ? WHERE guild_id = ?;'),
  updateDisabledCommands: db.prepare('UPDATE settings SET disabled_commands = ? WHERE guild_id = ?;'),
  updateModLogId: db.prepare('UPDATE settings SET mod_log_id = ? WHERE guild_id = ?;'),
  updateMemberLogId: db.prepare('UPDATE settings SET member_log_id = ? WHERE guild_id = ?;'),
  updateNicknameLogId: db.prepare('UPDATE settings SET nickname_log_id = ? WHERE guild_id = ?;'),
  updateRoleLogId: db.prepare('UPDATE settings SET role_log_id = ? WHERE guild_id = ?;'),
  updateMessageEditLogId: db.prepare('UPDATE settings SET message_edit_log_id = ? WHERE guild_id = ?;'),
  updateMessageDeleteLogId: db.prepare('UPDATE settings SET message_delete_log_id = ? WHERE guild_id = ?;'),
  updateVerificationRoleId: db.prepare('UPDATE settings SET verification_role_id = ? WHERE guild_id = ?;'),
  updateVerificationChannelId: db.prepare('UPDATE settings SET verification_channel_id = ? WHERE guild_id = ?;'),
  updateVerificationMessage: db.prepare('UPDATE settings SET verification_message = ? WHERE guild_id = ?;'),
  updateVerificationMessageId: db.prepare('UPDATE settings SET verification_message_id = ? WHERE guild_id = ?;'),
  updateWelcomeChannelId: db.prepare('UPDATE settings SET welcome_channel_id = ? WHERE guild_id = ?;'),
  updateWelcomeMessage: db.prepare('UPDATE settings SET welcome_message = ? WHERE guild_id = ?;'),
  updateFarewellChannelId: db.prepare('UPDATE settings SET farewell_channel_id = ? WHERE guild_id = ?;'),
  updateFarewellMessage: db.prepare('UPDATE settings SET farewell_message = ? WHERE guild_id = ?;'),
  updatePointTracking: db.prepare('UPDATE settings SET point_tracking = ? WHERE guild_id = ?;'),
  updateMessagePoints: db.prepare('UPDATE settings SET message_points = ? WHERE guild_id = ?;'),
  updateCommandPoints: db.prepare('UPDATE settings SET command_points = ? WHERE guild_id = ?;'),
  updateVoicePoints: db.prepare('UPDATE settings SET voice_points = ? WHERE guild_id = ?;'),
  updateCrownRoleId: db.prepare('UPDATE settings SET crown_role_id = ? WHERE guild_id = ?;'),
  updateCrownChannelId: db.prepare('UPDATE settings SET crown_channel_id = ? WHERE guild_id = ?;'),
  updateCrownMessage: db.prepare('UPDATE settings SET crown_message = ? WHERE guild_id = ?;'),
  updateCrownSchedule: db.prepare('UPDATE settings SET crown_schedule = ? WHERE guild_id = ?;'),
  deleteGuild: db.prepare('DELETE FROM settings WHERE guild_id = ?;')
};

// USERS TABLE
const users = {
  insertRow: db.prepare(`
    INSERT OR IGNORE INTO users (
      user_id, 
      user_name,
      user_discriminator,
      guild_id, 
      guild_name, 
      date_joined,
      bot,
      points,
      total_points,
      current_member
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 1);
  `),

  // Selects
  selectRow: db.prepare('SELECT * FROM users WHERE user_id = ? AND guild_id = ?;'),
  selectLeaderboard: db.prepare('SELECT * FROM users WHERE guild_id = ? AND current_member = 1 ORDER BY points DESC;'),
  selectPoints: db.prepare('SELECT points FROM users WHERE user_id = ? AND guild_id = ?;'),
  selectTotalPoints: db.prepare('SELECT total_points FROM users WHERE user_id = ? AND guild_id = ?;'),
  selectWarns: db.prepare('SELECT warns FROM users WHERE user_id = ? AND guild_id = ?;'),
  selectCurrentMembers: db.prepare('SELECT * FROM users WHERE guild_id = ? AND current_member = 1;'),
  selectMissingMembers: db.prepare('SELECT * FROM users WHERE guild_id = ? AND current_member = 0;'),

  // Updates
  updateGuildName: db.prepare('UPDATE users SET guild_name = ? WHERE guild_id = ?;'),
  updateUser: db.prepare('UPDATE users SET user_name = ?, user_discriminator = ? WHERE user_id = ?;'),
  updatePoints: db.prepare(`
    UPDATE users 
    SET points = points + @points, total_points = total_points + @points
    WHERE user_id = ? AND guild_id = ?;
  `),
  wipePoints: db.prepare('UPDATE users SET points = 0 WHERE user_id = ? AND guild_id = ?;'),
  wipeTotalPoints: db.prepare('UPDATE users SET points = 0, total_points = 0 WHERE user_id = ? AND guild_id = ?;'),
  wipeAllPoints: db.prepare('UPDATE users SET points = 0 WHERE guild_id = ?;'),
  wipeAllTotalPoints: db.prepare('UPDATE users SET points = 0, total_points = 0 WHERE guild_id = ?;'),
  updateWarns: db.prepare('UPDATE users SET warns = ? WHERE user_id = ? AND guild_id = ?;'),
  updateCurrentMember: db.prepare('UPDATE users SET current_member = ? WHERE user_id = ? AND guild_id = ?;'),
  deleteGuild: db.prepare('DELETE FROM users WHERE guild_id = ?;')
};

module.exports = {
  settings,
  users
};