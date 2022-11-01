import {
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
} from 'discord.js'
import Client from 'structures/Client'
import { CommandType } from 'structures/enums'

/**
 * Type definition of a command's run function.
 *
 * @param Client - The instantiated client
 * @param interaction - The interaction that prompted the command
 */
type RunFunction = (
  client: Client,
  interaction: ChatInputCommandInteraction,
) => Promise<void> | void

/**
 * Type definition of a slash command.
 */
type SlashCommand =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>

/**
 * Interface of all available options used for command creation.
 */
interface CommandOptions {
  data: SlashCommand

  type?: CommandType
  run: RunFunction
}

/**
 * Interface implemented by the Command class.
 */
interface ICommand extends CommandOptions {
  type: CommandType
}

/**
 * The Command class provides the structure for all bot commands.
 */
export default class Command implements ICommand {
  /** Data representing a slash command which will be sent to the Discord API. */
  public data: SlashCommand

  /** The command type.
   * @defaultValue `CommandType.Misc`
   */
  public type: CommandType

  /** Handles all logic relating to command execution. */
  public run: RunFunction

  public constructor({ data, type = CommandType.Misc, run }: CommandOptions) {
    this.data = data
    this.type = type
    this.run = run
  }
}
