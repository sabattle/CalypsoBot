import { stripIndents } from 'common-tags'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, Image, Url } from 'enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription("Provides a link to the bot's GitHub repository."),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const { member } = Command.getMember(interaction)

    const embed = new EmbedBuilder()
      .setTitle('GitHub Repository')
      .setThumbnail(Image.Calypso)
      .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
      .setDescription(
        stripIndents`
          Click [here](${Url.GithubRepository}) to visit my GitHub repository!
          Please support me by starring ⭐ my repo!
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
        .setURL(Url.Donate)
        .setLabel('Donate'),
    )

    await client.reply(interaction, { embeds: [embed], components: [row] })
  },
})
