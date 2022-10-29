import chalk from 'chalk'
import Table from 'cli-table3'
import {
  Client as DiscordClient,
  ClientEvents,
  Collection,
  type ClientOptions,
  type Snowflake,
} from 'discord.js'
import glob from 'glob'
import logger from 'logger'
import Command from 'structures/Command'
import type Event from 'structures/Event'
import { promisify } from 'util'

const glob_ = promisify(glob)

interface CommandModule {
  default: Command
}

interface EventModule {
  default: Event<keyof ClientEvents>
}

interface ClientConfig {
  clientId: Snowflake
  token: string
  guildId: Snowflake
}

const styling: Table.TableConstructorOptions = {
  chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
  style: {
    head: ['yellow'],
  },
}

export default class Client extends DiscordClient {
  #token: string
  public commands: Collection<string, Command> = new Collection()

  public constructor(config: ClientConfig, options: ClientOptions) {
    super(options)

    this.#token = config.token
  }

  #registerError(err: Error | unknown, name: string): void {
    if (err instanceof Error) {
      logger.error(err.message)
      logger.error(`${name} failed to load`)
    } else {
      logger.error(err)
    }
  }

  async #registerCommands(): Promise<void> {
    logger.info('Registering commands...')

    const files = await glob_(`${__dirname}/../commands/*/*{.ts,.js}`)
    if (files.length === 0) {
      logger.warn('No commands found')
      return
    }

    const table = new Table({
      head: ['File', 'Name', 'Aliases', 'Type', 'Status'],
      ...styling,
    })

    let count = 0

    for (const f of files) {
      const name = f.split('.').at(-2) || ''
      try {
        const command = ((await import(f)) as CommandModule).default
        const { aliases, type } = command
        if (command.name) {
          this.commands.set(command.name, command)
          table.push([
            f,
            name,
            aliases.join(', '),
            type,
            chalk['green']('pass'),
          ])
          count++
        } else throw Error(`Command name not set: ${name}`)
      } catch (err) {
        this.#registerError(err, name)
        table.push([f, name, '', '', chalk['red']('fail')])
      }
    }

    logger.info(`\n${table.toString()}`)
    logger.info(`Registered ${count} commands(s)`)
  }

  async #registerEvents(): Promise<void> {
    logger.info('Registering events...')

    const files = await glob_(`${__dirname}/../events/*{.ts,.js}`)
    if (files.length === 0) {
      logger.warn('No events found')
      return
    }

    const table = new Table({
      head: ['File', 'Name', 'Status'],
      ...styling,
    })

    let count = 0

    for (const f of files) {
      const name = f.split('.').at(-2) || ''
      try {
        const event = ((await import(f)) as EventModule).default
        this.on(event.event, event.run)
        table.push([f, name, chalk['green']('pass')])
        count++
      } catch (err) {
        this.#registerError(err, name)
        table.push([f, name, chalk['red']('fail')])
      }
    }

    logger.info(`\n${table.toString()}`)
    logger.info(`Registered ${count} event(s)`)
  }

  async init(): Promise<void> {
    await this.#registerCommands()
    await this.#registerEvents()
    await this.login(this.#token)
  }
}
