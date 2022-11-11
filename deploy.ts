/* eslint-disable @typescript-eslint/no-unused-vars */
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import logger from 'logger'
import config from 'config'
import { basename, join, resolve } from 'path'
import { promisify } from 'util'
import glob from 'glob'
import { type StructureModule } from 'structures/Client'
import { type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js'
import type Command from 'structures/Command'
const { token, clientId, guildId } = config

const glob_ = promisify(glob)

const _loadCommands = async (): Promise<
  RESTPostAPIChatInputApplicationCommandsJSONBody[]
> => {
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
  console.log(__dirname);
  console.log(`${__dirname}/src/commands/*/*{.ts,.js}`);
  const files = await glob_(`${resolve(join(__dirname, './src/commands'))}/*/*{.ts,.js}`)

  if (files.length === 0) {
    logger.warn('No commands found')
    return commands
  }

  for (const f of files) {
    const name = basename(f, '.ts')
    try {
      const command = ((await import(f)) as StructureModule<Command>).default
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
    console.log(commands);
    //await rest.put(applicationCommands, { body: commands })
    logger.info(`Commands successfully deployed`)
  } catch (err) {
    if (err instanceof Error) logger.error(err.stack)
    else logger.error(err)
  }
})()

