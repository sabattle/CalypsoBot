import chalk from 'chalk'
import Table from 'cli-table3'
import {
  type ChatInputCommandInteraction,
  type ClientEvents,
  type ClientOptions,
  Collection,
  Client as DiscordClient,
  EmbedBuilder,
} from 'discord.js'
import glob from 'glob'
import logger from 'logger'
import { basename } from 'path'
import Command from 'structures/Command'
import type Event from 'structures/Event'
import { promisify } from 'util'
import { Color, Emoji, type ErrorType } from './enums'

const glob_ = promisify(glob)

/**
 * Interface representing a Command import.
 */
export interface CommandModule {
  default: Command
}

/**
 * Interface representing an Event import.
 */
interface EventModule {
  default: Event<keyof ClientEvents>
}

/**
 * Interface of all available options used by the client for its config.
 */
interface ClientConfig {
  token: string
  debug: boolean
}

const styling: Table.TableConstructorOptions = {
  chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
  style: {
    head: ['yellow'],
  },
}

/**
 * The Client class provides the structure for the bot itself.
 *
 * @remarks
 * This should only ever be instantiated once.
 */
export default class Client extends DiscordClient {
  /** The client token. */
  readonly #token: string

  /** Whether or not debug mode is enabled. */
  public readonly debug: boolean

  /**
   * Collection of all commands mapped by their name.
   *
   * @defaultValue `new Collection()`
   */
  public commands: Collection<string, Command> = new Collection()

  public constructor({ token, debug }: ClientConfig, options: ClientOptions) {
    super(options)

    this.#token = token
    this.debug = debug
  }

  /**
   * Handles loading commands and mapping them in the commands collection.
   */
  async #registerCommands(): Promise<void> {
    logger.info('Registering commands...')

    const files = await glob_(`${__dirname}/../commands/*/*{.ts,.js}`)
    if (files.length === 0) {
      logger.warn('No commands found')
      return
    }

    const table = new Table({
      head: ['File', 'Name', 'Type', 'Status'],
      ...styling,
    })

    let count = 0

    for (const f of files) {
      const name = basename(f, '.ts')
      try {
        const command = ((await import(f)) as CommandModule).default
        if (command.data.name) {
          this.commands.set(command.data.name, command)
          table.push([f, name, command.type, chalk['green']('pass')])
          count++
        } else throw Error(`Command name not set: ${name}`)
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Command failed to register: ${name}`)
          logger.error(err.message)
          table.push([f, name, '', '', chalk['red']('fail')])
        } else logger.error(err)
      }
    }

    logger.info(`\n${table.toString()}`)
    logger.info(`Registered ${count} command(s)`)
  }

  /**
   * Loads all events and registers them to the client.
   */
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
      const name = basename(f, '.ts')
      if (name === 'debug' && !this.debug) continue
      try {
        const event = ((await import(f)) as EventModule).default
        this.on(event.event, event.run)
        table.push([f, name, chalk['green']('pass')])
        count++
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Event failed to register: ${name}`)
          logger.error(err.message)
          table.push([f, name, '', '', chalk['red']('fail')])
        } else logger.error(err)
        table.push([f, name, chalk['red']('fail')])
      }
    }

    logger.info(`\n${table.toString()}`)
    logger.info(`Registered ${count} event(s)`)
  }

  public async replyWithError(
    interaction: ChatInputCommandInteraction,
    type: ErrorType,
    message: string,
  ): Promise<void> {
    if (!this.isReady()) return
    const { user } = interaction
    const member = interaction.inCachedGuild() ? interaction.member : undefined
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: this.user.tag,
            iconURL: this.user.displayAvatarURL(),
          })
          .setTitle(`${Emoji.Fail}  Error: \`${type}\``)
          .setDescription(message)
          .setFooter({
            text: member?.displayName || user.username,
            iconURL: member?.displayAvatarURL() || user.displayAvatarURL(),
          })
          .setColor(Color.Red)
          .setTimestamp(),
      ],
      ephemeral: true,
    })
  }

  /**
   * Initializes the client.
   */
  public async init(): Promise<void> {
    await this.#registerCommands()
    await this.#registerEvents()
    await this.login(this.#token)
  }
}
