import { stripIndents } from 'common-tags'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, ErrorType, Image, Url } from 'enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('reportbug')
    .setDescription(
      "Sends a message to the Calypso Support Server's bug reports channel.",
    )
    .addStringOption((option) =>
      option
        .setName('bugreport')
        .setDescription('The bug to report.')
        .setRequired(true),
    ),
  type: CommandType.Miscellaneous,
  run: async (client, interaction): Promise<void> => {
    const { user, guild, options } = interaction
    const { member } = Command.getMember(interaction)

    // Get bug report channel
    const bugReportChannel = client.channels.cache.get(
      client.bugReportChannelId,
    )
    if (!bugReportChannel || !bugReportChannel.isTextBased())
      return client.replyWithError(
        interaction,
        ErrorType.CommandFailure,
        'Unable to fetch bug report channel. Please try again later.',
      )

    const embed = new EmbedBuilder()
      .setTitle('Bug Report')
      .setThumbnail(Image.Calypso)
      .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
      .setDescription(options.getString('bugreport'))
      .setFields([
        { name: 'User', value: user.tag, inline: true },
        {
          name: 'Server',
          value: interaction.guild?.name ?? '`none`',
          inline: true,
        },
      ])
      .setTimestamp()
    await client.send(bugReportChannel, { embeds: [embed] })

    await client.reply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle('Bug Report Sent')
          .setThumbnail(Image.Calypso)
          .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
          .setDescription(
            stripIndents`
              Your bug report was successfully sent!
              Please join the [Calypso Support Server](${Url.SupportServer}) for further discussion.
            `,
          )
          .setFooter({
            text: member?.displayName ?? user.username,
            iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
      ephemeral: true,
    })
  },
})
