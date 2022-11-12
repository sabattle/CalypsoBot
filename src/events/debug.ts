import { Event } from '@structures'
import { Events } from 'discord.js'
import logger from 'logger'

export default new Event(Events.Debug, (message) => {
  logger.info(message)
})
