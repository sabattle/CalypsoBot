import chalk from 'chalk'
import Table from 'cli-table3'
import {
  BaseGuildTextChannel,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  type ClientEvents,
  type ClientOptions,
  Collection,
  Client as DiscordClient,
  EmbedBuilder,
  type InteractionReplyOptions,
  type InteractionResponse,
  type InteractionUpdateOptions,
  type Message,
  type MessageComponentInteraction,
  type MessageCreateOptions,
  type MessagePayload,
  PermissionFlagsBits,
  type SelectMenuInteraction,
  type Snowflake,
  type TextBasedChannel,
  type WebhookEditMessageOptions,
} from 'discord.js'
import glob from 'glob'
import logger from 'logger'
import { basename, sep } from 'path'
import { promisify } from 'util'
import { Color, Emoji, type ErrorType } from 'enums'
import type { Event } from '@structures/Event'
import type { Command } from '@structures/Command'
import type { Component } from '@structures/Component'
import { ConfigCache } from '@structures/ConfigCache'
import type { StructureImport } from 'types'

const glob_ = promisify(glob)

/**
 * Interface of all available options used by the client for its config.
 */
interface ClientConfig {
  token: string
  ownerIds: Snowflake[]
  feedbackChannelId: Snowflake
  bugReportChannelId: Snowflake
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
export class Client<
  Ready extends boolean = boolean,
> extends DiscordClient<Ready> {
  /** The client token. */
  readonly #token: string

  /** List of owner IDs. */
  public readonly ownerIds: Snowflake[]

  /** The feedback channel ID. */
  public readonly feedbackChannelId: Snowflake

  /** The bug report channel ID. */
  public readonly bugReportChannelId: Snowflake

  /** Whether or not debug mode is enabled. */
  public readonly debug: boolean

  /**
   * Collection of all guild configs mapped by their guild ID.
   *
   * @defaultValue `new ConfigCache()`
   */
  public configs: ConfigCache = new ConfigCache()

  /**
   * Collection of all commands mapped by their name.
   *
   * @defaultValue `new Collection()`
   */
  public commands: Collection<string, Command> = new Collection()

  /**
   * Collection of all buttons mapped by their custom ID.
   *
   * @defaultValue `new Collection()`
   */
  public buttons: Collection<string, Component<ButtonInteraction>> =
    new Collection()

  /**
   * Collection of all select menus mapped by their custom ID.
   *
   * @defaultValue `new Collection()`
   */
  public selectMenus: Collection<string, Component<SelectMenuInteraction>> =
    new Collection()

  public constructor(
    {
      token,
      ownerIds,
      feedbackChannelId,
      bugReportChannelId,
      debug,
    }: ClientConfig,
    options: ClientOptions,
  ) {
    super(options)

    this.#token = token
    this.ownerIds = ownerIds
    this.feedbackChannelId = feedbackChannelId
    this.bugReportChannelId = bugReportChannelId
    this.debug = debug
  }

  /**
   * Loads all events and registers them to the client.
   */
  async #registerEvents(): Promise<void> {
    logger.info('Registering events...')

    const files = await glob_(
      `${__dirname.split(sep).join('/')}/../events/*{.ts,.js}`,
    )
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
      let name = basename(f)
      name = name.substring(0, name.lastIndexOf('.')) || name
      if (name === 'debug' && !this.debug) continue

      try {
        const event = (
          (await import(f)) as StructureImport<Event<keyof ClientEvents>>
        ).default
        this.on(event.event, event.run.bind(null, this))
        table.push([f, name, chalk.green('pass')])
        count++
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Event failed to register: ${name}`)
          logger.error(err.stack)
          table.push([f, name, chalk.red('fail')])
        } else logger.error(err)
      }
    }

    logger.info(`\n${table.toString()}`)
    logger.info(`Registered ${count} event(s)`)
  }

  /**
   * Handles loading commands and mapping them in the commands collection.
   */
  async #registerCommands(): Promise<void> {
    logger.info('Registering commands...')

    const files = await glob_(
      `${__dirname.split(sep).join('/')}/../commands/*/*{.ts,.js}`,
    )
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
      let name = basename(f)
      name = name.substring(0, name.lastIndexOf('.')) || name

      try {
        const command = ((await import(f)) as StructureImport<Command>).default
        if (command.data.name) {
          this.commands.set(command.data.name, command)
          table.push([f, name, command.type, chalk.green('pass')])
          count++
        } else throw Error(`Command name not set: ${name}`)
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Command failed to register: ${name}`)
          logger.error(err.stack)
          table.push([f, name, '', chalk.red('fail')])
        } else logger.error(err)
      }
    }

    logger.info(`\n${table.toString()}`)
    logger.info(`Registered ${count} command(s)`)
  }

  /**
   * Handles loading components and mapping them in their respective collection.
   */
  async #registerComponents(): Promise<void> {
    logger.info('Registering components...')

    const files = await glob_(
      `${__dirname.split(sep).join('/')}/../components/*/*{.ts,.js}`,
    )
    if (files.length === 0) {
      logger.warn('No components found')
      return
    }

    const table = new Table({
      head: ['File', 'Name', 'Type', 'Status'],
      ...styling,
    })

    let count = 0

    for (const f of files) {
      let name = basename(f)
      name = name.substring(0, name.lastIndexOf('.')) || name
      const type = f.split('/').at(-2) as 'buttons' | 'selectMenus'

      try {
        const component = (
          (await import(f)) as StructureImport<
            Component<MessageComponentInteraction>
          >
        ).default
        const { customId } = component
        if (customId) {
          this[type].set(customId, component)
          table.push([f, name, type, chalk.green('pass')])
          count++
        } else throw Error(`Component custom ID not set: ${name}`)
      } catch (err) {
        if (err instanceof Error) {
          logger.error(`Component failed to register: ${name}`)
          logger.error(err.stack)
          table.push([f, name, type, chalk.red('fail')])
        } else logger.error(err)
      }
    }

    logger.info(`\n${table.toString()}`)
    logger.info(`Registered ${count} component(s)`)
  }

  /**
   * Checks if the bot is allowed to respond in a channel.
   *
   * @param channel - The channel that should be checked
   * @returns `true` or `false`
   */
  public isAllowed(channel: TextBasedChannel): boolean {
    if (
      channel instanceof BaseGuildTextChannel &&
      (!channel.guild.members.me ||
        !channel.viewable ||
        !channel
          .permissionsFor(channel.guild.members.me)
          .has(
            PermissionFlagsBits.ViewChannel | PermissionFlagsBits.SendMessages,
          ))
    )
      return false
    else return true
  }

  /**
   * Sends a message safely by checking channel permissions before sending the message.
   *
   * @param channel - The channel to send the message in
   * @param options - Options for configuring the message
   * @returns The message sent
   */
  public async send(
    channel: TextBasedChannel,
    options: string | MessagePayload | MessageCreateOptions,
  ): Promise<Message | undefined> {
    if (!this.isAllowed(channel)) return
    return channel.send(options)
  }

  /**
   * Replies safely by checking channel permissions before sending the response.
   *
   * @param options - Options for configuring the interaction reply
   * @returns The message or interaction response
   */
  // Steal the overloads \o/
  public reply(
    interaction:
      | ChatInputCommandInteraction
      | ButtonInteraction
      | SelectMenuInteraction,
    options: InteractionReplyOptions & { fetchReply: true },
  ): Promise<Message>
  public reply(
    interaction:
      | ChatInputCommandInteraction
      | ButtonInteraction
      | SelectMenuInteraction,
    options: string | MessagePayload | InteractionReplyOptions,
  ): Promise<InteractionResponse>
  public async reply(
    interaction:
      | ChatInputCommandInteraction
      | ButtonInteraction
      | SelectMenuInteraction,
    options: string | MessagePayload | InteractionReplyOptions,
  ): Promise<Message | InteractionResponse | undefined> {
    const { channel } = interaction
    if (interaction.inCachedGuild() && channel && !this.isAllowed(channel))
      return
    return interaction.reply(options)
  }

  /**
   * Edits the reply safely by checking channel permissions before editing.
   *
   * @param options - Options for configuring the interaction edit
   * @returns The edited message
   */
  public async editReply(
    interaction:
      | ChatInputCommandInteraction
      | ButtonInteraction
      | SelectMenuInteraction,
    options: string | MessagePayload | WebhookEditMessageOptions,
  ): Promise<Message | undefined> {
    const { channel } = interaction
    if (interaction.inCachedGuild() && channel && !this.isAllowed(channel))
      return
    return interaction.editReply(options)
  }

  /**
   * Updates the interaction safely by checking channel permissions before updating.
   *
   * @param options - Options for configuring the interaction update
   * @returns The updated message or interaction response
   */
  // Steal the overloads again \o/ \o/
  public update(
    interaction: MessageComponentInteraction,
    options: InteractionUpdateOptions & { fetchReply: true },
  ): Promise<Message>
  public update(
    interaction: MessageComponentInteraction,
    options: string | MessagePayload | InteractionUpdateOptions,
  ): Promise<InteractionResponse>
  public async update(
    interaction: MessageComponentInteraction,
    options: string | MessagePayload | InteractionUpdateOptions,
  ): Promise<Message | InteractionResponse | undefined> {
    const { channel } = interaction
    if (interaction.inCachedGuild() && channel && !this.isAllowed(channel))
      return
    return interaction.update(options)
  }

  /**
   * Helper function to provide a standardized way of responding to the user with an error message.
   *
   * @param type - The type of error
   * @param message - The error message to be sent to the user
   */
  public async replyWithError(
    interaction:
      | ChatInputCommandInteraction
      | ButtonInteraction
      | SelectMenuInteraction,
    type: ErrorType,
    message: string,
  ): Promise<void> {
    if (!this.isReady()) return
    const { user } = interaction
    const member = interaction.inCachedGuild() ? interaction.member : null
    await this.reply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: this.user.tag,
            iconURL: this.user.displayAvatarURL(),
          })
          .setTitle(`${Emoji.Fail}  Error: \`${type}\``)
          .setDescription(message)
          .setFooter({
            text: member?.displayName ?? user.username,
            iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
          })
          .setColor(Color.Error)
          .setTimestamp(),
      ],
      ephemeral: true,
    })
  }

  /**
   * Initializes the client.
   */
  public async init(): Promise<void> {
    await this.#registerEvents()
    await this.#registerCommands()
    await this.#registerComponents()
    await this.login(this.#token)
  }
}
