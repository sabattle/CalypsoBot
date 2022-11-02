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

/**
 * Enum representing all Calypso images used in commands.
 */
export enum Image {
  Calypso = 'https://raw.githubusercontent.com/sabattle/CalypsoBot/main/images/Calypso.png',
  CalypsoTitle = 'https://raw.githubusercontent.com/sabattle/CalypsoBot/main/images/CalypsoTitle.png',
}

/**
 * Enum representing all URLs relating to Calypso.
 */
export enum Url {
  Invite = 'https://discord.com/api/oauth2/authorize?client_id=416451977380364288&permissions=1099914374230&scope=applications.commands%20bot',
  SupportServer = 'https://discord.gg/9SpsSG5VWh',
  GithubRepository = 'https://github.com/sabattle/CalypsoBot',
  Donate = 'https://github.com/sabattle/CalypsoBot',
}
