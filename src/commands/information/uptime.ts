import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, Image } from 'enums'

/* eslint-disable import/no-named-as-default-member */
dayjs.extend(duration)
dayjs.extend(advancedFormat)
/* eslint-enable import/no-named-as-default-member */

export default new Command({
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription("Gets the bot's current uptime."),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const { member } = Command.getMember(interaction)

    const d = dayjs.duration(client.uptime)
    const days = `${d.days()} day${d.days() == 1 ? '' : 's'}`
    const hours = `${d.hours()} hour${d.hours() == 1 ? '' : 's'}`
    const minutes = `${d.minutes()} minute${d.minutes() == 1 ? '' : 's'}`
    const seconds = `${d.seconds()} second${d.seconds() == 1 ? '' : 's'}`
    const date = dayjs().subtract(d.days(), 'day').format('dddd, MMMM Do YYYY')

    const embed = new EmbedBuilder()
      .setTitle(
        `${guild?.members.me?.displayName ?? client.user.username}'s Uptime`,
      )
      .setThumbnail(Image.Calypso)
      .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
      .setDescription(
        `\`\`\`prolog\n${days}, ${hours}, ${minutes}, and ${seconds}\`\`\``,
      )
      .setFields({ name: 'Date Launched', value: date, inline: true })
      .setFooter({
        text: member?.displayName ?? user.username,
        iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
      })

      .setTimestamp()

    await client.reply(interaction, { embeds: [embed] })
  },
})
