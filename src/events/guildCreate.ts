import prisma from 'prisma'
import { Events } from 'discord.js'
import logger from 'logger'
import { Event } from '@structures'

export default new Event(Events.GuildCreate, async (client, guild) => {
  const { id: guildId, name } = guild

  await prisma.guild.create({
    data: {
      guildId,
      name,
      config: {},
    },
  })

  logger.info(`Calypso has joined ${name}`)
})
