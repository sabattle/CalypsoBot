import { EmbedBuilder, Events } from 'discord.js'
import { Image } from 'structures/enums'
import Event from 'structures/Event'

export default new Event(Events.MessageCreate, async (client, message) => {
  const { guild, channel, author, content } = message

  if (!client.isReady() || author.bot) return
  if (
    content === `<@${client.user.id}>` ||
    content === `<@!${client.user.id}>`
  ) {
    const embed = new EmbedBuilder()
      .setTitle(
        `Hi, I'm ${
          guild?.members.me?.displayName ?? client.user.username
        }. Need help?`,
      )
      .setThumbnail(Image.Calypso)
      .setColor(
        guild?.members.me?.displayHexColor ??
          client.user.hexAccentColor ??
          null,
      )
      .setDescription(
        'You can see everything I can do by using the `/help` command.',
      )
      .setFooter({
        text: 'DM Nettles#8880 to speak directly with the developer!',
      })

    await client.send(channel, { embeds: [embed] })
  }
})
