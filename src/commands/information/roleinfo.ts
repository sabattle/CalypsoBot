import dayjs from 'dayjs'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { CommandType } from 'enums'
import { getPermissions } from 'utils'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Displays role information.')
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('The role to display the information of.')
        .setRequired(true),
    )
    .setDMPermission(false),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    if (!interaction.inCachedGuild()) return
    const { guild, member, options } = interaction

    await guild.members.fetch() // Fetch before snagging role

    const role = options.getRole('role')
    if (!role) return

    const {
      id,
      position,
      mentionable,
      managed,
      hoist,
      hexColor,
      members,
      createdAt,
    } = role

    const permissions = getPermissions(role)

    const revPosition = `\`${guild.roles.cache.size - position}\`**/**\`${
      guild.roles.cache.size
    }\``

    const embed = new EmbedBuilder()
      .setTitle('Role Information')
      .setThumbnail(guild.iconURL())
      .setColor(hexColor)
      .setFields([
        { name: 'Role', value: `${role}`, inline: true },
        {
          name: 'ID',
          value: `\`${id}\``,
          inline: true,
        },
        {
          name: 'Position',
          value: `${revPosition}`,
          inline: true,
        },
        {
          name: 'Mentionable',
          value: `\`${mentionable}\``,
          inline: true,
        },
        {
          name: 'Bot Role',
          value: `\`${managed}\``,
          inline: true,
        },
        {
          name: 'Hoisted',
          value: `\`${hoist}\``,
          inline: true,
        },
        {
          name: 'Color',
          value: `\`${hexColor.toUpperCase()}\``,
          inline: true,
        },
        {
          name: 'Members',
          value: `\`${members.size}\``,
          inline: true,
        },
        {
          name: 'Created On',
          value: `\`${dayjs(createdAt).format('MMM DD YYYY')}\``,
          inline: true,
        },
        {
          name: 'Permissions',
          value: `\`\`\`diff\n${permissions.join('\n')}\`\`\``,
          inline: true,
        },
      ])
      .setFooter({
        text: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setTimestamp()

    await client.reply(interaction, { embeds: [embed] })
  },
})
