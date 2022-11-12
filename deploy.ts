import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import logger from 'logger'
import config from 'config'
import { basename, sep } from 'path'
import { promisify } from 'util'
import glob from 'glob'
import { type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js'
import type { StructureImport } from 'types'
import type { Command } from '@structures'

const { token, clientId, guildId } = config

const glob_ = promisify(glob)

const _loadCommands = async (): Promise<
  RESTPostAPIChatInputApplicationCommandsJSONBody[]
> => {
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
  const files = await glob_(
    `${__dirname.split(sep).join('/')}/src/commands/*/*{.ts,.js}`,
  )
  if (files.length === 0) {
    logger.warn('No commands found')
    return commands
  }

  for (const f of files) {
    const name = basename(f, '.ts')
    try {
      const command = ((await import(f)) as StructureImport<Command>).default
      commands.push(command.data.toJSON())
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`Command failed to import: ${name}`)
        logger.error(err.stack)
      } else logger.error(err)
    }
  }

  return commands
}

const rest = new REST({ version: '10' }).setToken(token)

logger.info('Deploying commands...')

const applicationCommands =
  process.env.NODE_ENV === 'production'
    ? Routes.applicationCommands(clientId)
    : Routes.applicationGuildCommands(clientId, guildId)

;(async (): Promise<void> => {
  try {
    const commands = await _loadCommands()
    await rest.put(applicationCommands, { body: commands })
    logger.info(`Commands successfully deployed`)
  } catch (err) {
    if (err instanceof Error) logger.error(err.stack)
    else logger.error(err)
  }
})()
