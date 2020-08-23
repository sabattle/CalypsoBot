const colors = require('../utils/colors.json');
const { oneLine } = require('common-tags');

module.exports = async (client, guild) => {
  
  // Update settings table
  client.db.settings.insertRow.run(
    guild.id,
    guild.name,
    guild.systemChannelID, // Default channel
    guild.systemChannelID, // Welcome channel
    guild.systemChannelID, // Leave channel
    guild.systemChannelID  // Crown Channel
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

  // Create default colors
  let fails = 0, position = 1;
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
        fails++;
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
  
  const len = Object.keys(colors).length;
  if (fails === len ) {
    client.sendSystemErrorMessage(guild, 'color create', oneLine`
      Unable to create default colors, please ensure I have the Manage Roles permission
    `);
  } else if (fails > 0) {
    client.sendSystemErrorMessage(guild, 'color create', oneLine`
      Unable to create ${fails} of ${len} default colors, please ensure there are open role slots
    `);
  }

  client.logger.info(`Calypso has joined ${guild.name}`);
};