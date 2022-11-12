import type {
  BaseInteraction,
  ClientEvents,
  MessageComponentInteraction,
} from 'discord.js'
import type { Client, Command, Component, Event } from '@structures'

/**
 * Generic interface representing a structure import.
 */
export interface StructureImport<
  TStructure extends
    | Event<keyof ClientEvents>
    | Command
    | Component<MessageComponentInteraction>,
> {
  default: TStructure
}

/**
 * Generic definition of a structure's run function.
 *
 * @param Client - The instantiated client
 * @param interaction - The interaction attached to the structure
 */
export type RunFunction<TInteraction extends BaseInteraction> = (
  client: Client<true>,
  interaction: TInteraction,
) => Promise<void> | void

/**
 * Type definition of a list of permissions.
 */
export type Permissions = bigint[]
