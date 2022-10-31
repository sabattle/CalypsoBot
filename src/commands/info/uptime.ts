import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import Command from 'structures/Command'
import { CommandType } from 'structures/enums'

/* eslint-disable import/no-named-as-default-member */
dayjs.extend(duration)
dayjs.extend(advancedFormat)
/* eslint-enable import/no-named-as-default-member */

export default new Command({
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Gets bots current uptime.'),
  type: CommandType.Info,
  run: async (client, interaction): Promise<void> => {
    if (!interaction.inCachedGuild()) return

    const {
      guild: {
        members: { me },
      },
      member,
    } = interaction

    const d = dayjs.duration(client.uptime || 0)
    const days = `${d.days()} day${d.days() == 1 ? '' : 's'}`
    const hours = `${d.hours()} hour${d.hours() == 1 ? '' : 's'}`
    const minutes = `${d.minutes()} minute${d.minutes() == 1 ? '' : 's'}`
    const seconds = `${d.seconds()} second${d.seconds() == 1 ? '' : 's'}`
    const date = dayjs().subtract(d.days(), 'day').format('dddd, MMMM Do YYYY')

    const embed = new EmbedBuilder()
      .setTitle(`${me?.displayName || ''}'s Uptime`)
      .setDescription(
        `\`\`\`prolog\n${days}, ${hours}, ${minutes}, and ${seconds}\`\`\``,
      )
      .setFields({ name: 'Date Launched', value: date, inline: true })
      .setFooter({
        text: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setTimestamp()
      .setColor(me?.displayHexColor || null)
    await interaction.reply({ embeds: [embed] })
  },
})
