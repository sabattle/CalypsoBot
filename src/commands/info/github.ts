import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'
import Command from 'structures/Command'
import { CommandType, Image, Url } from 'structures/enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription("Provides a link to bot's GitHub repository."),
  type: CommandType.Info,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const member = interaction.inCachedGuild() ? interaction.member : undefined

    const embed = new EmbedBuilder()
      .setTitle('GitHub Repository')
      .setThumbnail(Image.Calypso)
      .setColor(
        guild?.members.me?.displayHexColor ||
          client.user?.hexAccentColor ||
          null,
      )
      .setDescription(
        `Click [here](${Url.GithubRepository}) to visit my GitHub repository!
        Please support me by starring ⭐ my repo!`,
      )
      .setFooter({
        text: member?.displayName || user.username,
        iconURL: user.displayAvatarURL(),
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
        .setLabel('Support Server'),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(Url.Donate)
        .setLabel('Donate'),
    )

    await interaction.reply({ embeds: [embed], components: [row] })
  },
})
