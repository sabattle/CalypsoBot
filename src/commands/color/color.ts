import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js'
import { Command, PaginatedEmbed } from '@structures'
import { Color, CommandType } from 'enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('color')
    .setDescription('Displays a list of colors to choose between.')
    .setDMPermission(false),
  type: CommandType.Color,
  permissions: [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageRoles,
  ],
  run: async (client, interaction): Promise<void> => {
    if (!interaction.inCachedGuild()) return
    const { guild, member } = interaction

    // Get colors
    const { colorRolePrefix } = (await client.configs.fetch(guild.id)) ?? {}
    if (!colorRolePrefix) return
    const colors = guild.roles.cache
      .filter((role) => role.name.startsWith(colorRolePrefix))
      .sort((a, b) => b.position - a.position)
      .map((c) => c)

    const embed = new EmbedBuilder()
      .setThumbnail(guild.iconURL())
      .setColor(guild.members.me?.displayHexColor ?? Color.Default)
      .setFooter({
        text: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setTimestamp()

    const interval = 25
    const pages = []

    for (let i = 0; i < colors.length; i += interval) {
      const max = Math.min(i + interval, colors.length)
      pages.push(
        EmbedBuilder.from(embed)
          .setTitle(`Available Colors [${i + 1} - ${max}/${colors.length}]`)
          .setDescription(colors.slice(i, max).join(' ')),
      )
    }

    await new PaginatedEmbed({
      client,
      interaction,
      pages,
    }).run()
  },
})
