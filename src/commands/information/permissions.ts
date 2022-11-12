import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { CommandType } from 'enums'
import { getPermissions } from 'utils'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('permissions')
    .setDescription("Displays a user's permissions.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to get the permissions of.')
        .setRequired(false),
    )
    .setDMPermission(false),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    const { targetMember, member } = Command.getMember(interaction)
    if (!targetMember || !member) return

    const permissions = getPermissions(targetMember)

    const embed = new EmbedBuilder()
      .setTitle(`${targetMember.displayName}'s Permissions`)
      .setThumbnail(targetMember.displayAvatarURL())
      .setColor(targetMember.displayHexColor)
      .setDescription(`\`\`\`diff\n${permissions.join('\n')}\`\`\``)
      .setFooter({
        text: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setTimestamp()

    await client.reply(interaction, { embeds: [embed] })
  },
})
