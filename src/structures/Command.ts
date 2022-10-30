import { CommandInteraction, type SlashCommandBuilder } from 'discord.js'
import Client from 'structures/Client'

/**
 * Enum representing all possible command types.
 */
export enum CommandType {
  Info = 'info',
}

/**
 * Type definition of a command's run function.
 *
 * @param Client - The instantiated client
 * @param interaction - The interaction that prompted the command
 */
type RunFunction = (
  client: Client,
  interaction: CommandInteraction,
) => Promise<void> | void

/**
 * Interface of all available options used for command creation.
 */
interface CommandOptions {
  data: SlashCommandBuilder
  type: CommandType
  run: RunFunction
}

type ICommand = CommandOptions

/**
 * The Command class provides the structure for all bot commands.
 */
export default class Command implements ICommand {
  /** Data representing a slash command which will be sent to the Discord API. */
  public data: SlashCommandBuilder

  /** The command type. */
  public type: CommandType

  /** Handles all logic relating to command execution. */
  public run: RunFunction

  public constructor({ data, type, run }: CommandOptions) {
    this.data = data
    this.type = type
    this.run = run
  }
}
