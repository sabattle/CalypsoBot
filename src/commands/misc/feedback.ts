import { stripIndents } from 'common-tags'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import Command from 'structures/Command'
import { CommandType, ErrorType, Image, Url } from 'structures/enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription(
      "Sends a message to the Calypso Support Server's feedback channel.",
    )
    .addStringOption((option) =>
      option
        .setName('feedback')
        .setDescription('The feedback to send.')
        .setMaxLength(4096)
        .setRequired(true),
    ),
  type: CommandType.Misc,
  run: async (client, interaction): Promise<void> => {
    const { user, guild, options } = interaction
    const member = interaction.inCachedGuild() ? interaction.member : undefined

    // Get feedback channel
    const feedbackChannel = client.channels.cache.get(client.feedbackChannelId)
    if (!feedbackChannel || !feedbackChannel.isTextBased())
      return client.replyWithError(
        interaction,
        ErrorType.CommandFailure,
        'Unable to fetch feedback channel. Please try again later.',
      )

    const embed = new EmbedBuilder()
      .setTitle('Feedback')
      .setThumbnail(Image.Calypso)
      .setColor(
        guild?.members.me?.displayHexColor ||
          client.user?.hexAccentColor ||
          null,
      )
      .setDescription(options.getString('feedback'))
      .setFields([
        { name: 'User', value: user.tag, inline: true },
        {
          name: 'Server',
          value: interaction.guild?.name || 'N/A',
          inline: true,
        },
      ])
      .setTimestamp()
    await client.send(feedbackChannel, { embeds: [embed] })

    await client.reply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle('Feedback Sent')
          .setThumbnail(Image.Calypso)
          .setColor(
            guild?.members.me?.displayHexColor ||
              client.user?.hexAccentColor ||
              null,
          )
          .setDescription(
            stripIndents`
        Your feedback was successfully sent!
        Please join the [Calypso Support Server](${Url.SupportServer}) for further discussion.
      `,
          )
          .setFooter({
            text: member?.displayName || user.username,
            iconURL: member?.displayAvatarURL() || user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
      ephemeral: true,
    })
  },
})
