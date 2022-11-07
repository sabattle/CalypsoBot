import { PermissionsBitField, type SelectMenuInteraction } from 'discord.js'
import Client from 'structures/Client'

/**
 * Type definition of a select menu's run function.
 *
 * @param Client - The instantiated client
 * @param interaction - The interaction attached to the select menu
 */
type RunFunction = (
  client: Client,
  interaction: SelectMenuInteraction,
) => Promise<void> | void

/**
 * Type definition of a select menu's list of permissions.
 */
type Permissions = bigint[]

/**
 * Interface of all available options used for select menu creation.
 */
interface SelectMenuOptions {
  customId: string
  permissions?: Permissions
  run: RunFunction
}

/**
 * The SelectMenu class provides the structure for all bot commands.
 */
export default class SelectMenu {
  public customId: string

  /**
   * List of client permissions needed to use the select menu.
   *
   * @defaultValue `[PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]`
   */
  public permissions: Permissions

  /** Handles all logic relating to select menu execution. */
  public run: RunFunction

  public constructor({
    customId,
    permissions = [
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ViewChannel,
    ],
    run,
  }: SelectMenuOptions) {
    this.customId = customId
    this.permissions = permissions
    this.run = run
  }
}
