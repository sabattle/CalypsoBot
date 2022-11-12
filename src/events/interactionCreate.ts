import {
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  Events,
  PermissionsBitField,
  type SelectMenuInteraction,
} from 'discord.js'
import logger from 'logger'
import { ErrorType } from 'enums'
import startCase from 'lodash/startCase'
import { type Client, type Command, type Component, Event } from '@structures'

/**
 * Utility function to check if the client is missing any necessary permissions.
 *
 * @param client - The instantiated client
 * @param interaction - The interaction that spawned the event
 * @param structure - The structure that is being executed
 * @returns `true` or `false`
 */
const hasPermission = async (
  client: Client<true>,
  interaction:
    | ChatInputCommandInteraction
    | ButtonInteraction
    | SelectMenuInteraction,
  structure:
    | Command
    | Component<ButtonInteraction>
    | Component<SelectMenuInteraction>,
): Promise<boolean> => {
  if (!interaction.inCachedGuild()) return true
  const permissions: string[] =
    interaction.channel
      ?.permissionsFor(client.user)
      ?.missing(structure.permissions)
      .map((p) => startCase(String(new PermissionsBitField(p).toArray()))) ?? []
  if (permissions.length != 0) {
    await client.replyWithError(
      interaction,
      ErrorType.MissingPermissions,
      `Sorry ${
        interaction.member
      }, I need the following permissions:\n \`\`\`diff\n- ${permissions.join(
        '\n- ',
      )}\`\`\``,
    )
    return false
  }
  return true
}

export default new Event(
  Events.InteractionCreate,
  async (client, interaction) => {
    if (!client.isReady()) return

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName)

      if (!command || !(await hasPermission(client, interaction, command)))
        return

      // Run command
      try {
        await command.run(client, interaction)
      } catch (err) {
        if (err instanceof Error) logger.error(err.stack)
        else logger.error(err)
      }
    } else if (interaction.isSelectMenu()) {
      const selectMenu = client.selectMenus.get(interaction.customId)

      if (
        !selectMenu ||
        !(await hasPermission(client, interaction, selectMenu))
      )
        return

      // Run select menu
      try {
        await selectMenu.run(client, interaction)
      } catch (err) {
        if (err instanceof Error) logger.error(err.stack)
        else logger.error(err)
      }
    }
  },
)
