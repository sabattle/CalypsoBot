/**
 * Enum representing all possible command types.
 */
export enum CommandType {
  Information = 'information',
  Fun = 'fun',
  Animals = 'animals',
  Color = 'color',
  Miscellaneous = 'miscellaneous',
}

/**
 * List of all possible error types.
 */
export enum ErrorType {
  MissingPermissions = 'Missing Permissions',
  CommandFailure = 'Command Failure',
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
  Owner = '<:owner:735338114230255616>',
  Voice = '<:voice:735665114870710413>',
  Online = '<:online:735341197450805279>',
  Dnd = '<:dnd:735341494537289768>',
  Idle = '<:idle:735341387842584648>',
  Offline = '<:offline:735341676121554986>',
  DiscordEmployee = '<:DISCORD_EMPLOYEE:735339014621626378>',
  DiscordPartner = '<:DISCORD_PARTNER:735339215746760784>',
  BugHunterLevel1 = '<:BUGHUNTER_LEVEL_1:735339352913346591>',
  BugHunterLevel2 = '<:BUGHUNTER_LEVEL_2:735339420667871293>',
  HypeSquadEvents = '<:HYPESQUAD_EVENTS:735339581087547392>',
  HouseBravery = '<:HOUSE_BRAVERY:735339756283756655>',
  HouseBrilliance = '<:HOUSE_BRILLIANCE:735339675102871642>',
  HouseBalance = '<:HOUSE_BALANCE:735339871018942466>',
  EarlySupporter = '<:EARLY_SUPPORTER:735340061226172589>',
  VerifiedBot = '<:VERIFIED_BOT:735345343037833267>',
  VerifiedDeveloper = '<:VERIFIED_DEVELOPER:735340154310361202>',
}

/**
 * Enum representing all color hexes used throughout the codebase.
 */
export enum Color {
  Default = '#1C5B4B',
  Error = '#FF0000',
}

/**
 * Enum representing all Calypso images used in commands.
 */
export enum Image {
  Calypso = 'https://raw.githubusercontent.com/sabattle/CalypsoBot/main/images/Calypso.png',
  CalypsoTitle = 'https://raw.githubusercontent.com/sabattle/CalypsoBot/main/images/Calypso_Title.png',
}

/**
 * Enum representing all URLs relating to Calypso.
 */
export enum Url {
  Invite = 'https://discord.com/api/oauth2/authorize?client_id=416451977380364288&permissions=1099914374230&scope=applications.commands%20bot',
  SupportServer = 'https://discord.gg/9SpsSG5VWh',
  GithubRepository = 'https://github.com/sabattle/CalypsoBot',
  Donate = 'https://www.paypal.com/paypalme/sebastianabattle',
}
