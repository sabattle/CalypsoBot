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
    .setName('donate')
    .setDescription("Provides a link to the bot's donation page."),
  type: CommandType.Info,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const member = interaction.inCachedGuild() ? interaction.member : undefined

    const embed = new EmbedBuilder()
      .setTitle('Donate')
      .setThumbnail(Image.Calypso)
      .setColor(
        guild?.members.me?.displayHexColor ||
          client.user?.hexAccentColor ||
          null,
      )
      .setDescription(
        `Click [here](${Url.Donate}) to donate!
        Thank you for helping to keep me running!`,
      )
      .setFooter({
        text: member?.displayName || user.username,
        iconURL: member?.displayAvatarURL() || user.displayAvatarURL(),
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
        .setURL(Url.GithubRepository)
        .setLabel('GitHub'),
    )

    await interaction.reply({ embeds: [embed], components: [row] })
  },
})
