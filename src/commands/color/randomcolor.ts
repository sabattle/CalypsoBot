import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js'
import { Command } from '@structures'
import { CommandType, ErrorType } from 'enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('randomcolor')
    .setDescription('Changes your current color to a randomly selected one.')
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
    const colors = guild.roles.cache.filter((role) =>
      role.name.startsWith(colorRolePrefix),
    )
    const randomColor = colors.random()
    const oldColor = member.roles.color ?? '`None`'
    if (colors.size === 0 || !randomColor) {
      await client.replyWithError(
        interaction,
        ErrorType.CommandFailure,
        `Sorry ${member}, there are no colors set on this server.`,
      )
      return
    }

    // Assign random color
    try {
      await member.roles.remove(colors)
      await member.roles.add(randomColor)
      await client.reply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle('Color Change')
            .setThumbnail(member.displayAvatarURL())
            .setColor(randomColor.hexColor)
            .setFields([
              { name: 'Member', value: `${member}`, inline: true },
              {
                name: 'Color',
                value: `${oldColor} ➔ ${randomColor}`,
                inline: true,
              },
            ])
            .setFooter({
              text: member.displayName,
              iconURL: member.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      })
    } catch (err) {
      await client.replyWithError(
        interaction,
        ErrorType.CommandFailure,
        `Sorry ${member}, please try again later.`,
      )
    }
  },
})
