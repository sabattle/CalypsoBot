import dayjs from 'dayjs'
import type { UserFlagsString } from 'discord.js'
import { ActivityType, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { CommandType, Emoji } from 'enums'

const statuses = {
  online: `${Emoji.Online} \`Online\``,
  idle: `${Emoji.Idle} \`AFK\``,
  offline: `${Emoji.Offline} \`Offline\``,
  invisible: `${Emoji.Offline} \`Offline\``,
  dnd: `${Emoji.Dnd} \`Do Not Disturb\``,
}

const badges: Record<UserFlagsString, string> = {
  Staff: `${Emoji.DiscordEmployee} \`Discord Employee\``,
  Partner: `${Emoji.DiscordPartner} \`Partnered Server Owner\``,
  BugHunterLevel1: `${Emoji.BugHunterLevel1} \`Bug Hunter (Level 1)\``,
  BugHunterLevel2: `${Emoji.BugHunterLevel2} \`Bug Hunter (Level 2)\``,
  Hypesquad: `${Emoji.HypeSquadEvents} \`HypeSquad Events\``,
  HypeSquadOnlineHouse1: `${Emoji.HouseBravery} \`House of Bravery\``,
  HypeSquadOnlineHouse2: `${Emoji.HouseBrilliance} \`House of Brilliance\``,
  HypeSquadOnlineHouse3: `${Emoji.HouseBalance} \`House of Balance\``,
  PremiumEarlySupporter: `${Emoji.EarlySupporter} \`Early Supporter\``,
  TeamPseudoUser: 'Team User',
  VerifiedBot: `${Emoji.VerifiedBot} \`Verified Bot\``,
  VerifiedDeveloper: `${Emoji.VerifiedDeveloper} \`Early Verified Bot Developer\``,
  CertifiedModerator: '',
  BotHTTPInteractions: '',
  Spammer: '',
  Quarantined: '',
}

export default new Command({
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription("Display's a user's information.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to get the information of.')
        .setRequired(false),
    )
    .setDMPermission(false),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    if (!interaction.inCachedGuild()) return
    const { targetMember, member } = Command.getMember(interaction)
    const {
      id,
      user,
      presence,
      roles,
      displayName,
      displayHexColor,
      joinedAt,
    } = targetMember

    const userFlags = (await user.fetchFlags()).toArray()

    // Get activities
    const activities = []
    let customStatus: string | null = null
    if (presence)
      for (const activity of presence.activities.values()) {
        switch (activity.type) {
          case ActivityType.Playing:
            activities.push(`Playing **${activity.name}**`)
            break
          case ActivityType.Listening:
            if (user.bot) activities.push(`Listening to **${activity.name}**`)
            else
              activities.push(
                `Listening to **${activity.details}** by **${activity.state}**`,
              )
            break
          case ActivityType.Watching:
            activities.push(`Watching **${activity.name}**`)
            break
          case ActivityType.Streaming:
            activities.push(`Streaming **${activity.name}**`)
            break
          case ActivityType.Custom:
            customStatus = activity.state
            break
        }
      }

    const embed = new EmbedBuilder()
      .setTitle(`${displayName}'s Information`)
      .setThumbnail(targetMember.displayAvatarURL())
      .setColor(displayHexColor)

      .setFields(
        { name: 'User', value: `${targetMember}`, inline: true },
        {
          name: 'Discriminator',
          value: `\`${user.discriminator}\``,
          inline: true,
        },
        {
          name: 'ID',
          value: `\`${id}\``,
          inline: true,
        },
        {
          name: 'Status',
          value: statuses[presence?.status ?? 'offline'],
          inline: true,
        },
        {
          name: 'Bot',
          value: `\`${user.bot}\``,
          inline: true,
        },
        {
          name: 'Color Role',
          value: `${roles.color ?? '`None`'}`,
          inline: true,
        },
        {
          name: 'Highest Role',
          value: `${roles.highest}`,
          inline: true,
        },
        {
          name: 'Join Server on',
          value: `\`${dayjs(joinedAt).format('MMM DD YYYY')}\``,
          inline: true,
        },
        {
          name: 'Joined Discord On',
          value: `\`${dayjs(user.createdAt).format('MMM DD YYYY')}\``,
          inline: true,
        },
      )
      .setFooter({
        text: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setTimestamp()
    if (activities.length > 0) embed.setDescription(activities.join('\n'))
    if (customStatus)
      embed.spliceFields(0, 0, { name: 'Custom Status', value: customStatus })
    if (userFlags.length > 0)
      embed.addFields([
        {
          name: 'Badges',
          value: userFlags.map((flag) => badges[flag]).join('\n'),
        },
      ])

    await client.reply(interaction, { embeds: [embed] })
  },
})
