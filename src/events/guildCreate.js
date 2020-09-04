const { MessageEmbed } = require('discord.js');
const colors = require('../utils/colors.json');
const { success } = require('../utils/emojis.json');

module.exports = async (client, guild) => {

  client.logger.info(`Calypso has joined ${guild.name}`);
  const serverLog = client.channels.cache.get(client.serverLogId);
  if (serverLog)
    serverLog.send(new MessageEmbed().setDescription(`${client.user} has joined **${guild.name}** ${success}`));

  /** ------------------------------------------------------------------------------------------------
   * CREATE/FIND SETTINGS
   * ------------------------------------------------------------------------------------------------ */ 
  // Find mod log
  const modLog = guild.channels.cache.find(c => c.name.replace('-', '').replace('s', '') === 'modlog' || 
    c.name.replace('-', '').replace('s', '') === 'moderatorlog');

  // Find admin and mod roles
  const adminRole = 
    guild.roles.cache.find(r => r.name.toLowerCase() === 'admin' || r.name.toLowerCase() === 'administrator');
  const modRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'mod' || r.name.toLowerCase() === 'moderator');

  // Create mute role
  let muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
  if (!muteRole) {
    try {
      muteRole = await guild.roles.create({
        data: {
          name: 'Muted',
          permissions: []
        }
      });
    } catch (err) {
      client.logger.error(err.message);
    }
    for (const channel of guild.channels.cache.values()) {
      try {
        if (channel.viewable && channel.permissionsFor(guild.me).has('MANAGE_ROLES')) {
          if (channel.type === 'text') // Deny permissions in text channels
            await channel.updateOverwrite(muteRole, {
              'SEND_MESSAGES': false,
              'ADD_REACTIONS': false
            });
          else if (channel.type === 'voice' && channel.editable) // Deny permissions in voice channels
            await channel.updateOverwrite(muteRole, {
              'SPEAK': false,
              'STREAM': false
            });
        } 
      } catch (err) {
        client.logger.error(err.stack);
      }
    }
  }
  
  // Create crown role
  let crownRole = guild.roles.cache.find(r => r.name === 'The Crown');
  if (!crownRole) {
    try {
      crownRole = await guild.roles.create({
        data: {
          name: 'The Crown',
          permissions: [],
          hoist: true
        }
      });
    } catch (err) {
      client.logger.error(err.message);
    }
  }

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
      member.bot ? 1 : 0
    );
  });

  /** ------------------------------------------------------------------------------------------------
   * DEFAULT COLORS
   * ------------------------------------------------------------------------------------------------ */ 
  // Create default colors
  let position = 1;
  for (let [key, value] of Object.entries(colors)){
    key = '#' + key;
    if (!guild.roles.cache.find(r => r.name === key)) {
      try {
        await guild.roles.create({
          data: {
            name: key,
            color: value,
            position: position,
            permissions: []
          }
        });
        position++; // Increment position to create roles in order
      } catch (err) {
        client.logger.error(err.message);
      }
    }
  }

  // Self-assign color
  try {
    const calypsoColor = guild.roles.cache.find(r => r.name === '#Seagrass');
    if (calypsoColor) await guild.me.roles.add(calypsoColor);
  } catch (err) {
    client.logger.error(err.message);
  }
  
};