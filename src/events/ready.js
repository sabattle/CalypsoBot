module.exports = async (client) => {
  
  const activities = [
    { name: 'your commands', type: 'LISTENING' }, 
    { name: '@Calypso', type: 'LISTENING' }
  ];

  // Update presence
  client.user.setPresence({ status: 'online', activity: activities[0] });

  let activity = 1;

  // Update activity every 30 seconds
  setInterval(() => {
    activities[2] = { name: `${client.guilds.cache.size} servers`, type: 'WATCHING' }; // Update server count
    activities[3] = { name: `${client.users.cache.size} users`, type: 'WATCHING' }; // Update user count
    if (activity > 3) activity = 0;
    client.user.setActivity(activities[activity]);
    activity++;
  }, 30000);

  client.logger.info('Updating database and scheduling jobs...');
  for (const guild of client.guilds.cache.values()) {

    /** ------------------------------------------------------------------------------------------------
     * FIND SETTINGS
     * ------------------------------------------------------------------------------------------------ */ 
    // Find mod log
    const modLog = guild.channels.cache.find(c => c.name.replace('-', '').replace('s', '') === 'modlog' || 
      c.name.replace('-', '').replace('s', '') === 'moderatorlog');

    // Find admin and mod roles
    const adminRole = 
      guild.roles.cache.find(r => r.name.toLowerCase() === 'admin' || r.name.toLowerCase() === 'administrator');
    const modRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'mod' || r.name.toLowerCase() === 'moderator');
    const muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
    const crownRole = guild.roles.cache.find(r => r.name === 'The Crown');

    /** ------------------------------------------------------------------------------------------------
     * UPDATE TABLES
     * ------------------------------------------------------------------------------------------------ */ 
    // Update settings table
    client.db.settings.insertRow.run(
      guild.id,
      guild.name,
      guild.systemChannelID, // Default channel
      guild.systemChannelID, // Welcome channel
      guild.systemChannelID, // Farewell channel
      guild.systemChannelID,  // Crown Channel
      modLog ? modLog.id : null,
      adminRole ? adminRole.id : null,
      modRole ? modRole.id : null,
      muteRole ? muteRole.id : null,
      crownRole ? crownRole.id : null
    );
    
    // Update users table
    guild.members.cache.forEach(member => {
      client.db.users.insertRow.run(
        member.id, 
        member.user.username, 
        member.user.discriminator,
        guild.id, 
        guild.name,
        member.joinedAt.toString(),
        member.user.bot ? 1 : 0
      );
    });
    
    /** ------------------------------------------------------------------------------------------------
     * CHECK DATABASE
     * ------------------------------------------------------------------------------------------------ */ 
    // If member left
    const currentMemberIds = client.db.users.selectCurrentMembers.all(guild.id).map(row => row.user_id);
    for (const id of currentMemberIds) {
      if (!guild.members.cache.has(id)) {
        client.db.users.updateCurrentMember.run(0, id, guild.id);
        client.db.users.wipeTotalPoints.run(id, guild.id);
      }
    }

    // If member joined
    const missingMemberIds = client.db.users.selectMissingMembers.all(guild.id).map(row => row.user_id);
    for (const id of missingMemberIds) {
      if (guild.members.cache.has(id)) client.db.users.updateCurrentMember.run(1, id, guild.id);
    }

    /** ------------------------------------------------------------------------------------------------
     * VERIFICATION
     * ------------------------------------------------------------------------------------------------ */ 
    // Fetch verification message
    const { verification_channel_id: verificationChannelId, verification_message_id: verificationMessageId } = 
      client.db.settings.selectVerification.get(guild.id);
    const verificationChannel = guild.channels.cache.get(verificationChannelId);
    if (verificationChannel && verificationChannel.viewable) {
      try {
        await verificationChannel.messages.fetch(verificationMessageId);
      } catch (err) { // Message was deleted
        client.logger.error(err);
      }
    }

    /** ------------------------------------------------------------------------------------------------
     * CROWN ROLE
     * ------------------------------------------------------------------------------------------------ */ 
    // Schedule crown role rotation
    client.utils.scheduleCrown(client, guild);

  }

  // Remove left guilds
  const dbGuilds = client.db.settings.selectGuilds.all();
  const guilds = client.guilds.cache.array();
  const leftGuilds = dbGuilds.filter(g1 => !guilds.some(g2 => g1.guild_id === g2.id));
  for (const guild of leftGuilds) {
    client.db.settings.deleteGuild.run(guild.guild_id);
    client.db.users.deleteGuild.run(guild.guild_id);

    client.logger.info(`Calypso has left ${guild.guild_name}`);
  }

  client.logger.info('Calypso is now online');
  client.logger.info(`Calypso is running on ${client.guilds.cache.size} server(s)`);
};
