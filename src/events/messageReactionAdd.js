const { MessageEmbed } = require('discord.js');
const { verify } = require('../utils/emojis.json');
const { stripIndent } = require('common-tags');

module.exports = async (client, messageReaction, user) => {

  if (client.user === user) return;

  const { message, emoji } = messageReaction;

  // Verification
  if (emoji.id === verify.split(':')[2].slice(0, -1)) {
    const { verification_role_id: verificationRoleId, verification_message_id: verificationMessageId } = 
    client.db.settings.selectVerification.get(message.guild.id);
    const verificationRole = message.guild.roles.cache.get(verificationRoleId);

    if (!verificationRole || message.id != verificationMessageId) return;

    const member = message.guild.members.cache.get(user.id);
    if (!member.roles.cache.has(verificationRole)) {
      try {
        await member.roles.add(verificationRole);
      } catch (err) {
        return client.sendSystemErrorMessage(member.guild, 'verification', 
          stripIndent`Unable to assign verification role,` +
          'please check the role hierarchy and ensure I have the Manage Roles permission'
          , err.message);
      }
    }
  }

  // Starboard
  if (emoji.name === '⭐' && message.author != user) {
    const starboardChannelId = client.db.settings.selectStarboardChannelId.pluck().get(message.guild.id);
    const starboardChannel = message.guild.channels.cache.get(starboardChannelId);
    if (
      !starboardChannel || 
      !starboardChannel.viewable ||
      !starboardChannel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) ||
      message.channel === starboardChannel
    ) return;

    const emojis = ['⭐', '🌟', '✨', '💫', '☄️'];
    const messages = await starboardChannel.messages.fetch({ limit: 100 });
    const starred = messages.find(m => {
      return emojis.some(e => {
        return m.content.startsWith(e) &&
          m.embeds[0] &&
          m.embeds[0].footer &&
          m.embeds[0].footer.text == message.id;
      });
    });

    // If message already in starboard
    if (starred) {
      const starCount = parseInt(starred.content.split(' ')[1].slice(2)) + 1;

      // Determine emoji type
      let emojiType;
      if (starCount > 20) emojiType = emojis[4];
      else if (starCount > 15) emojiType = emojis[3];
      else if (starCount > 10) emojiType = emojis[2];
      else if (starCount > 5) emojiType = emojis[1];
      else emojiType = emojis[0];

      const starMessage = await starboardChannel.messages.fetch(starred.id);
      await starMessage.edit(`${emojiType} **${starCount}  |**  ${message.channel}`)
        .catch(err => client.logger.error(err.stack));

    // New starred message
    } else {

      // Check for attachment image
      let image = '';
      const attachment = message.attachments.array()[0];
      if (attachment && attachment.url) {
        const extension = attachment.url.split('.').pop();
        if (/(jpg|jpeg|png|gif)/gi.test(extension)) image = attachment.url;
      }

      // Check for url
      if (!image && message.embeds[0] && message.embeds[0].url) {
        const extension = message.embeds[0].url.split('.').pop();
        if (/(jpg|jpeg|png|gif)/gi.test(extension)) image = message.embeds[0].url;
      }
      
      if (!message.content && !image) return;

      const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true}))
        .setDescription(message.content)
        .addField('Original', `[Jump!](${message.url})`)
        .setImage(image)
        .setTimestamp()
        .setFooter(message.id)
        .setColor('#ffac33');
      await starboardChannel.send(`⭐ **1  |**  ${message.channel}`, embed);
    }
  }
};