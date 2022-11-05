import {
  type ChatInputCommandInteraction,
  type GuildMember,
  PermissionsBitField,
  type SlashCommandBuilder,
  type User,
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
 * Type definition of a command's list of permissions.
 */
type Permissions = bigint[]

/**
 * Interface of all available options used for command creation.
 */
interface CommandOptions {
  data: SlashCommand
  type?: CommandType
  permissions?: Permissions
  run: RunFunction
}

/**
 * Interface implemented by the Command class.
 */
interface ICommand extends CommandOptions {
  type: CommandType
  permissions: Permissions
}

/**
 * The Command class provides the structure for all bot commands.
 */
export default class Command implements ICommand {
  /** Data representing a slash command which will be sent to the Discord API. */
  public data: SlashCommand

  /**
   * The command type.
   *
   * @defaultValue `CommandType.Misc`
   */
  public type: CommandType

  /**
   * List of client permissions needed to run the command.
   *
   * @defaultValue `[PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]`
   */
  public permissions: Permissions

  /** Handles all logic relating to command execution. */
  public run: RunFunction

  public constructor({
    data,
    type = CommandType.Misc,
    permissions = [
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ViewChannel,
    ],
    run,
  }: CommandOptions) {
    this.data = data
    this.type = type
    this.permissions = permissions
    this.run = run
  }

  /**
   * Determines the member the command is targeting.
   * If no user was given as a command argument, then the original user becomes the target.
   *
   * @remarks
   * `targetMember` should be used anywhere requiring the interaction option user.
   * `member` references the original user who created the interaction.
   *
   * @param interaction - The interaction that spawned the command
   * @returns An object containing the target member and original member
   */
  public static getMember(interaction: ChatInputCommandInteraction): {
    targetMember: GuildMember | null
    member: GuildMember | null
  } {
    if (!interaction.inCachedGuild())
      return { targetMember: null, member: null }
    const { member, options } = interaction
    const targetMember = options.getMember('user') || member
    return { targetMember, member }
  }

  /**
   * Determines the user or member the command is targeting.
   * If no user was given as a command argument, then the original user becomes the target.
   *
   * @remarks
   * `targetMember` and `targetUser` should be used anywhere requiring the interaction option user.
   * `member` and `user` reference the original user who created the interaction.
   *
   * @param interaction - The interaction that spawned the command
   * @returns An object containing the target member, original member, target user, and original user
   */
  public static getMemberAndUser(interaction: ChatInputCommandInteraction): {
    targetMember: GuildMember | null
    member: GuildMember | null
    targetUser: User
    user: User
  } {
    const { user, options } = interaction
    const targetUser = options.getUser('user') || user
    const { targetMember, member } = this.getMember(interaction)
    return { targetMember, member, targetUser, user }
  }
}
