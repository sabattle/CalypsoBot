import { ClientEvents } from 'discord.js'

/**
 * Generic Event class which provides the structure for all events.
 *
 * @typeParam K - Key which must be one of the following event types: {@link https://discord.js.org/#/docs/discord.js/main/typedef/Events}
 */
export default class Event<K extends keyof ClientEvents> {
  public constructor(
    /** The event type */
    public event: K,

    /**
     * Handles all logic relating to event execution.
     *
     * @param args - List of arguments for the event
     */
    public run: (...args: ClientEvents[K]) => Promise<void> | void,
  ) {}
}
