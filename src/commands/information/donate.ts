import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, Image, Url } from 'enums'
import { stripIndents } from 'common-tags'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('donate')
    .setDescription("Provides a link to the bot's donation page."),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const { member } = Command.getMember(interaction)

    const embed = new EmbedBuilder()
      .setTitle('Donate')
      .setThumbnail(Image.Calypso)
      .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
      .setDescription(
        stripIndents`
          Click [here](${Url.Donate}) to donate!
          Thank you for helping to keep me running!
        `,
      )
      .setFooter({
        text: member?.displayName ?? user.username,
        iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
      })
      .setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(Url.Invite)
        .setLabel('Invite Me'),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(Url.SupportServer)
        .setLabel('Server'),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(Url.GithubRepository)
        .setLabel('GitHub'),
    )

    await client.reply(interaction, { embeds: [embed], components: [row] })
  },
})
