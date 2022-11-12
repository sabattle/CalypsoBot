import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType } from 'enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('findid')
    .setDescription('Finds the ID of the given user or role.')
    .addMentionableOption((option) =>
      option
        .setName('target')
        .setDescription('The target to find the ID of.')
        .setRequired(true),
    )
    .setDMPermission(false),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    if (!interaction.inCachedGuild()) return
    const { user, guild, member, options } = interaction
    const target = options.getMentionable('target')
    if (!target) return

    const embed = new EmbedBuilder()
      .setTitle('Find ID')
      .setColor(guild.members.me?.displayHexColor ?? Color.Default)
      .setFields([
        { name: 'Target', value: `${target}`, inline: true },
        {
          name: 'ID',
          value: `\`${target.id}\``,
          inline: true,
        },
      ])
      .setFooter({
        text: member.displayName || user.username,
        iconURL: member.displayAvatarURL() || user.displayAvatarURL(),
      })
      .setTimestamp()

    await client.reply(interaction, { embeds: [embed] })
  },
})
