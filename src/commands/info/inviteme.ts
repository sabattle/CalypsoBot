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
    .setName('inviteme')
    .setDescription('Provides a link to invite the bot.'),
  type: CommandType.Info,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const member = interaction.inCachedGuild() ? interaction.member : undefined

    const embed = new EmbedBuilder()
      .setTitle('Invite Me!')
      .setThumbnail(Image.Calypso)
      .setColor(
        guild?.members.me?.displayHexColor ||
          client.user?.hexAccentColor ||
          null,
      )
      .setDescription(
        `Click [here](${Url.Invite}) to invite me to your server!`,
      )
      .setFooter({
        text: member?.displayName || user.username,
        iconURL: user.displayAvatarURL(),
      })
      .setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(Url.SupportServer)
        .setLabel('Support Server'),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(Url.GithubRepository)
        .setLabel('GitHub'),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(Url.Donate)
        .setLabel('Donate'),
    )

    await interaction.reply({ embeds: [embed], components: [row] })
  },
})
