const { MessageEmbed } = require('discord.js');

module.exports = (client, oldMessage, newMessage) => {

  if (newMessage.webhookID) return; // Check for webhook

  // Detect edited commands
  if (
    newMessage.member && 
    newMessage.id === newMessage.member.lastMessageID &&
    !oldMessage.command
  ) {
    client.emit('message', newMessage);
  }

  const embed = new MessageEmbed()
    .setAuthor(`${newMessage.author.tag}`, newMessage.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor(newMessage.guild.me.displayHexColor);

  // Content change
  if (oldMessage.content != newMessage.content) {

    // Dont send logs for starboard edits
    const starboardChannelId = client.db.settings.selectStarboardChannelId.pluck().get(newMessage.guild.id);
    const starboardChannel = newMessage.guild.channels.cache.get(starboardChannelId);
    if (newMessage.channel == starboardChannel) return;

    // Get message edit log
    const messageEditLogId = client.db.settings.selectMessageEditLogId.pluck().get(newMessage.guild.id);
    const messageEditLog = newMessage.guild.channels.cache.get(messageEditLogId);
    if (
      messageEditLog &&
      messageEditLog.viewable &&
      messageEditLog.permissionsFor(newMessage.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {

      if (newMessage.content.length > 1024) newMessage.content = newMessage.content.slice(0, 1021) + '...';
      if (oldMessage.content.length > 1024) oldMessage.content = oldMessage.content.slice(0, 1021) + '...';

      embed
        .setTitle('Message Update: `Edit`')
        .setDescription(`
          ${newMessage.member}'s **message** in ${newMessage.channel} was edited. [Jump to message!](${newMessage.url})
        `)
        .addField('Before', oldMessage.content)
        .addField('After', newMessage.content);
      messageEditLog.send(embed);
    }
  }

  // Embed delete
  if (oldMessage.embeds.length > newMessage.embeds.length) {
    // Get message delete log
    const messageDeleteLogId = client.db.settings.selectMessageDeleteLogId.pluck().get(newMessage.guild.id);
    const messageDeleteLog = newMessage.guild.channels.cache.get(messageDeleteLogId);
    if (
      messageDeleteLog &&
      messageDeleteLog.viewable &&
      messageDeleteLog.permissionsFor(newMessage.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {

      embed.setTitle('Message Update: `Delete`');
      if (oldMessage.embeds.length > 1)
        embed.setDescription(`${newMessage.member}'s **message embeds** in ${newMessage.channel} were deleted.`);
      else
        embed.setDescription(`${newMessage.member}'s **message embed** in ${newMessage.channel} was deleted.`);
      messageDeleteLog.send(embed);
    }
  }
};