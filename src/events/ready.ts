import { Events } from 'discord.js'
import logger from 'logger'
import Event from 'structures/Event'

export default new Event(Events.ClientReady, (client) => {
  const {
    user: { username },
    guilds,
  } = client
  logger.info(`${username} is now online`)
  logger.info(`${username} is running on ${guilds.cache.size} server(s)`)
})
