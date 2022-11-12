import type { ClientEvents } from 'discord.js'
import type { Client } from '@structures/Client'

/**
 * Generic Event class which provides the structure for all events.
 *
 * @typeParam K - Key which must be one of the following event types: {@link https://discord.js.org/#/docs/discord.js/main/typedef/Events}
 */
export class Event<K extends keyof ClientEvents> {
  public constructor(
    /** The event type */
    public event: K,

    /**
     * Handles all logic relating to event execution.
     *
     * @param client - The client to bind to the event
     * @param args - List of arguments for the event
     */
    public run: (
      client: Client,
      ...args: ClientEvents[K]
    ) => Promise<void> | void,
  ) {}
}
