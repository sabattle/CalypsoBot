import prisma from 'prisma'
import { type ActivitiesOptions, ActivityType, Events } from 'discord.js'
import logger from 'logger'
import { Event } from '@structures'

export default new Event(Events.ClientReady, async (client) => {
  if (!client.isReady()) return
  const { user, guilds } = client

  const activities: ActivitiesOptions[][] = [
    [{ name: 'your commands', type: ActivityType.Listening }],
    [{ name: '@Calypso', type: ActivityType.Listening }],
  ]

  // Update presence
  user.setPresence({ status: 'online', activities: activities[0] })

  let activity = 1

  // Update activity every 30 seconds
  setInterval(() => {
    activities[2] = [
      {
        name: `${guilds.cache.size} servers`,
        type: ActivityType.Watching,
      },
    ] // Update server count
    if (activity > 2) activity = 0
    user.setActivity(activities[activity][0])
    activity++
  }, 30000)

  // Update guilds
  logger.info('Updating guilds...')
  for (const guild of guilds.cache.values()) {
    const { id: guildId, name } = guild
    await prisma.guild.upsert({
      where: {
        guildId,
      },
      update: {
        name,
      },
      create: {
        guildId,
        name,
        config: {},
      },
    })
  }

  logger.info(`${user.username} is now online`)
  logger.info(`${user.username} is running on ${guilds.cache.size} server(s)`)
})
