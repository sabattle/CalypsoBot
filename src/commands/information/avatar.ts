import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { CommandType } from 'enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Displays a user's avatar.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to get the avatar of.')
        .setRequired(false),
    ),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    const { targetMember, member, targetUser, user } =
      Command.getMemberAndUser(interaction)

    const embed = new EmbedBuilder()
      .setTitle(`${targetMember?.displayName ?? targetUser.username}'s Avatar`)
      .setColor(
        targetMember?.displayHexColor ??
          (await targetUser.fetch(true)).hexAccentColor ??
          null,
      )
      .setImage(
        targetMember?.displayAvatarURL({ size: 512 }) ??
          targetUser.displayAvatarURL({ size: 512 }),
      )
      .setFooter({
        text: member?.displayName ?? user.username,
        iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
      })
      .setTimestamp()

    await client.reply(interaction, { embeds: [embed] })
  },
})
