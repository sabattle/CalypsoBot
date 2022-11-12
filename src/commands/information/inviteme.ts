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
    .setName('inviteme')
    .setDescription('Provides a link to invite the bot.'),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const { member } = Command.getMember(interaction)

    const embed = new EmbedBuilder()
      .setTitle('Invite Me!')
      .setThumbnail(Image.Calypso)
      .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
      .setDescription(`Click [here](${Url.Invite}) to invite me!`)
      .setFooter({
        text: member?.displayName ?? user.username,
        iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
      })
      .setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(Url.SupportServer)
        .setLabel('Server'),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(Url.GithubRepository)
        .setLabel('GitHub'),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(Url.Donate)
        .setLabel('Donate'),
    )

    await client.reply(interaction, { embeds: [embed], components: [row] })
  },
})
