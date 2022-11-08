import { type ActivitiesOptions, ActivityType, Events } from 'discord.js'
import logger from 'logger'
import Event from 'structures/Event'

export default new Event(Events.ClientReady, (client) => {
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
        name: `${client.guilds.cache.size} servers`,
        type: ActivityType.Watching,
      },
    ] // Update server count
    if (activity > 2) activity = 0
    user.setActivity(activities[activity][0])
    activity++
  }, 30000)

  logger.info(`${user.username} is now online`)
  logger.info(`${user.username} is running on ${guilds.cache.size} server(s)`)
})
