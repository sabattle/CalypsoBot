import database from 'database'
import { Events } from 'discord.js'
import logger from 'logger'
import Event from 'structures/Event'

export default new Event(Events.GuildCreate, async (client, guild) => {
  const { id: guildId, name } = guild

  await database.guild.create({
    data: {
      guildId,
      name,
    },
  })

  logger.info(`Calypso has joined ${name}`)
})
