import dayjs from 'dayjs'
import { Collection, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType } from 'enums'

const channelTypes = {
  0: 'Text',
  2: 'Voice',
  4: 'Category',
  5: 'Announcement',
  10: 'Announcement Thread',
  11: 'Public Thread',
  12: 'Private Thread',
  13: 'Stage Voice',
  15: 'Forum',
}

export default new Command({
  data: new SlashCommandBuilder()
    .setName('channelinfo')
    .setDescription('Displays channel information.')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to display the information of.')
        .setRequired(false),
    )
    .setDMPermission(false),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    if (!interaction.inCachedGuild()) return
    const { guild, member, options } = interaction

    await guild.members.fetch() // Fetch before snagging channel

    const channel = options.getChannel('channel') ?? interaction.channel
    if (!channel) return

    const { id, type, createdAt, members } = channel
    let memberCount: number
    let botCount: number

    if (members instanceof Collection) {
      memberCount = members.size
      botCount = members.filter((member) => member.user.bot).size
    } else {
      memberCount = members.cache.size
      botCount = members.cache.filter((member) => member.user?.bot).size
    }

    const embed = new EmbedBuilder()
      .setTitle('Channel Information')
      .setThumbnail(guild.iconURL())
      .setColor(guild.members.me?.displayHexColor ?? Color.Default)
      .setFields([
        { name: 'Channel', value: `${channel}`, inline: true },
        {
          name: 'ID',
          value: `\`${id}\``,
          inline: true,
        },
        {
          name: 'Type',
          value: `\`${channelTypes[type]}\``,
          inline: true,
        },
        {
          name: 'Members',
          value: `\`${memberCount}\``,
          inline: true,
        },
        {
          name: 'Bots',
          value: `\`${botCount}\``,
          inline: true,
        },
        {
          name: 'Created On',
          value: `\`${dayjs(createdAt).format('MMM DD YYYY')}\``,
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
