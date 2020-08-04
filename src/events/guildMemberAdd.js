const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = async (client, member) => {

  /** ------------------------------------------------------------------------------------------------
   * AUTO ROLE
   * ------------------------------------------------------------------------------------------------ */ 
  // Get auto role
  const autoRoleId = client.db.settings.selectAutoRoleId.pluck().get(member.guild.id);
  const autoRole = member.guild.roles.cache.get(autoRoleId);
  if (autoRole) {
    try {
      await member.roles.add(autoRole);
    } catch (err) {
      return client.sendSystemErrorMessage(member.guild, 'auto role', oneLine`
        Something went wrong. Unable to give ${autoRole} to ${member}. 
        Please check the role hierarchy and ensure I have the \`Manage Roles\` permission.
      `, err.message);
    }
  }

  /** ------------------------------------------------------------------------------------------------
   * WELCOME MESSAGES
   * ------------------------------------------------------------------------------------------------ */ 
  if (member.guild.me.hasPermission('SEND_MESSAGES') && member.guild.me.hasPermission('EMBED_LINKS')) {
    // Get welcome channel
    let { welcome_channel_id: welcomeChannelId, welcome_message: welcomeMessage } = 
      client.db.settings.selectWelcomeMessages.get(member.guild.id);
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

    // Send welcome message
    if (welcomeChannel && welcomeChannel.viewable && welcomeMessage) {
      welcomeMessage = welcomeMessage.replace('?member', member); // Member substitution
      welcomeChannel.send(new MessageEmbed().setDescription(welcomeMessage).setColor(member.guild.me.displayHexColor));
    }
  }
  /** ------------------------------------------------------------------------------------------------
   * RANDOM COLOR
   * ------------------------------------------------------------------------------------------------ */ 
  // Assign random color
  const randomColor = client.db.settings.selectRandomColor.pluck().get(member.guild.id);
  if (randomColor) {
    const prefix = client.db.settings.selectPrefix.pluck().get(member.guild.id);
    const colors = member.guild.roles.cache.filter(c => c.name.startsWith('#')).array();

    // Check length
    if (colors.length === 0) return client.sendSystemErrorMessage(member.guild, 'random color', oneLine`
      Something went wrong. Unable to give a random color to ${member}. 
      There are currently no colors set on this server. Use \`${prefix}togglerandomcolor\` to disable this feature.
    `);

    const color = colors[Math.floor(Math.random() * colors.length)]; // Get color
    try {
      await member.roles.add(color);
    } catch (err) {
      return client.sendSystemErrorMessage(member.guild, 'random color', oneLine`
        Something went wrong. Unable to give ${color} to ${member}. 
        Please check the role hierarchy and ensure I have the \`Manage Roles\` permission.
      `, err.message);
    }
  }

  /** ------------------------------------------------------------------------------------------------
   * USERS TABLE
   * ------------------------------------------------------------------------------------------------ */ 
  // Update users table
  client.db.users.insertRow.run(
    member.id, 
    member.user.username, 
    member.user.discriminator,
    member.guild.id, 
    member.guild.name,
    member.joinedAt.toString(),
    member.user.bot ? 1 : 0
  );
  
  // If member already in users table
  const missingMemberIds = client.db.users.selectMissingMembers.all(member.guild.id).map(row => row.user_id);
  if (missingMemberIds.includes(member.id)) client.db.users.updateCurrentMember.run(1, member.id, member.guild.id);

  client.logger.info(`${member.guild.name}: ${member.user.tag} has joined the server`);
};