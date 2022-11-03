import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js'
import startCase from 'lodash/startCase'
import Command from 'structures/Command'
import { CommandType } from 'structures/enums'

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
  type: CommandType.Info,
  run: async (client, interaction): Promise<void> => {
    const { targetMember, member } = await Command.getTargetMemberOrSelf(
      interaction,
    )
    if (!targetMember || !member) return

    // Get member permissions
    const memberPermissions = targetMember.permissions.toArray() as string[]
    const allPermissions = Object.keys(PermissionFlagsBits)
    const permissions = []
    for (const permission of allPermissions) {
      if (memberPermissions.includes(permission))
        permissions.push(`+ ${startCase(permission)}`)
      else permissions.push(`- ${startCase(permission)}`)
    }

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

    await interaction.reply({ embeds: [embed] })
  },
})
