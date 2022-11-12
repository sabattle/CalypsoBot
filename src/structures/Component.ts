import {
  type MessageComponentInteraction,
  PermissionsBitField,
} from 'discord.js'
import type { Permissions, RunFunction } from 'types'

/**
 * Interface of all available options used for component creation.
 */
export interface ComponentOptions<
  TInteraction extends MessageComponentInteraction,
> {
  customId: string
  permissions?: Permissions
  run: RunFunction<TInteraction>
}

/**
 * The generic Component class provides the structure for all components.
 */
export class Component<TInteraction extends MessageComponentInteraction> {
  public readonly customId: string

  /**
   * List of client permissions needed to use the component.
   *
   * @defaultValue `[PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]`
   */
  public readonly permissions: Permissions

  /** Handles all logic relating to component execution. */
  public run: RunFunction<TInteraction>

  public constructor({
    customId,
    permissions = [
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ViewChannel,
    ],
    run,
  }: ComponentOptions<TInteraction>) {
    this.customId = customId
    this.permissions = permissions
    this.run = run
  }
}
