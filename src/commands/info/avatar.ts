import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import Command from 'structures/Command'
import { CommandType } from 'structures/enums'

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
  type: CommandType.Info,
  run: async (client, interaction): Promise<void> => {
    const { targetUser, targetMember, user, member } =
      await Command.getTargetUserOrMemberOrSelf(interaction)

    const embed = new EmbedBuilder()
      .setTitle(`${targetMember?.displayName || targetUser.username}'s Avatar`)
      .setColor(
        targetMember?.displayHexColor || targetUser.hexAccentColor || null,
      )
      .setImage(
        targetMember?.displayAvatarURL({ size: 512 }) ||
          targetUser.displayAvatarURL({ size: 512 }),
      )
      .setFooter({
        text: member?.displayName || user.username,
        iconURL: member?.displayAvatarURL() || user.displayAvatarURL(),
      })
      .setTimestamp()

    await client.reply(interaction, { embeds: [embed] })
  },
})
