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

interface ModuleType {
  default: Event<keyof ClientEvents>
}

interface ClientConfig {
  clientId: Snowflake
  token: string
  guildId: Snowflake
}

export default class Client extends DiscordClient {
  #token: string
  public commands: Collection<string, Command> = new Collection()

  public constructor(config: ClientConfig, options: ClientOptions) {
    super(options)

    this.#token = config.token
  }

  async #registerEvents(): Promise<void> {
    logger.info('Loading events...')

    const files = await glob_(`${__dirname}/../events/*{.ts,.js}`)
    if (files.length === 0) logger.warn('No events found')
    let count = 0

    const table = new Table({
      head: ['File', 'Name', 'Status'],
      chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
      style: {
        head: ['yellow'],
      },
    })

    for (const f of files) {
      const name = f.split('/').pop() || ''
      try {
        const event: Event<keyof ClientEvents> = (
          (await import(f)) as ModuleType
        ).default
        this.on(event.event, event.run)
        table.push([f, name, chalk['green']('pass')])
        count++
      } catch (err) {
        if (err instanceof Error) {
          logger.error(err.message)
          logger.error(`${name} failed to load`)
          table.push([f, name, chalk['red']('fail')])
        } else {
          logger.error(err)
        }
      }
    }

    logger.info(`\n${table.toString()}`)
    logger.info(`Loaded ${count} event(s)`)
  }

  async init(): Promise<void> {
    await this.#registerEvents()
    await this.login(this.#token)
  }
}
