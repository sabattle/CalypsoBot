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
  public static async getTargetMemberOrSelf(
    interaction: ChatInputCommandInteraction,
  ): Promise<{
    targetMember: GuildMember | undefined
    member: GuildMember | undefined
  }> {
    if (!interaction.inCachedGuild())
      return { targetMember: undefined, member: undefined }
    const {
      guild: { members },
      member,
      options,
    } = interaction
    const user = options.getUser('user')
    const targetMember = user
      ? members.cache.get(user.id) || (await members.fetch(user.id))
      : interaction.member

    return { targetMember, member }
  }

  /**
   * Determines the user or member the command is targeting.
   * If no user was given as a command argument, then the original user becomes the target.
   *
   * @remarks
   * `targetUser` and `targetMember` should be used anywhere requiring the interaction option user.
   * `user` and `member` reference the original user who created the interaction.
   *
   * @param interaction - The interaction that spawned the command
   * @returns An object containing the target user, target member, original user, and original member
   */
  public static async getTargetUserOrMemberOrSelf(
    interaction: ChatInputCommandInteraction,
  ): Promise<{
    targetUser: User
    targetMember: GuildMember | undefined
    user: User
    member: GuildMember | undefined
  }> {
    const { user, options } = interaction
    let member: GuildMember | undefined
    const targetUser = options.getUser('user') || user
    let targetMember: GuildMember | undefined
    if (interaction.inCachedGuild()) {
      const { guild } = interaction
      ;({ member } = interaction)
      targetMember =
        guild.members.cache.get(targetUser.id) ||
        (await guild.members.fetch(targetUser.id))
    }
    return { targetUser, targetMember, user, member }
  }
}
