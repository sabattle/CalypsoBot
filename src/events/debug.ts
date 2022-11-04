import { Events } from 'discord.js'
import logger from 'logger'
import Event from 'structures/Event'

export default new Event(Events.Debug, (message) => {
  logger.info(message)
})
