/**
 * Enum representing all possible command types.
 */
export enum CommandType {
  Info = 'info',
  Misc = 'misc',
}

/**
 * Enum representing all possible emojis.
 *
 * @remarks
 * If cloning this project and self-hosting the bot,
 * you MUST replace the IDs of these values with emoji IDs from your own server.
 */
export enum Emoji {
  Pong = '<:pong:747295268201824307>',
  Fail = '<:fail:736449226120233031>',
}

/**
 * Enum representing all color hexes used throughout the codebase.
 */
export enum Color {
  Red = '#FF0000',
}
