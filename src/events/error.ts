import { Event } from '@structures'
import { Events } from 'discord.js'
import logger from 'logger'

export default new Event(Events.Error, (err) => {
  logger.error(err)
})
