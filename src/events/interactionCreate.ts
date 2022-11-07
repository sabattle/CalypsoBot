import {
  ChatInputCommandInteraction,
  Events,
  PermissionsBitField,
  SelectMenuInteraction,
} from 'discord.js'
import logger from 'logger'
import Event from 'structures/Event'
import { ErrorType } from 'structures/enums'
import startCase from 'lodash/startCase'
import SelectMenu from 'structures/SelectMenu'
import Command from 'structures/Command'
import Client from 'structures/Client'

const checkClientPermissions = (
  client: Client<true>,
  interaction:
    | ChatInputCommandInteraction<'cached'>
    | SelectMenuInteraction<'cached'>,
  object: Command | SelectMenu,
): string[] => {
  const permissions: string[] =
    interaction.channel
      ?.permissionsFor(client.user)
      ?.missing(object.permissions)
      .map((p) => startCase(String(new PermissionsBitField(p).toArray()))) || []
  return permissions
}

export default new Event(
  Events.InteractionCreate,
  async (client, interaction) => {
    if (!client.isReady()) return

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName)

      // Return if no command
      if (!command) return

      // Reply with error if missing permissions and return
      if (interaction.inCachedGuild()) {
        const permissions = checkClientPermissions(client, interaction, command)
        if (permissions.length != 0) {
          await client.replyWithError(
            interaction,
            ErrorType.MissingPermissions,
            `Sorry ${
              interaction.member
            }, I need the following permissions for this command:\n \`\`\`diff\n- ${permissions.join(
              '\n- ',
            )}\`\`\``,
          )
          return
        }
      }

      // Run command
      try {
        await command.run(client, interaction)
      } catch (err) {
        if (err instanceof Error) logger.error(err.stack)
        else logger.error(err)
      }
    } else if (interaction.isSelectMenu()) {
      const selectMenu = client.selectMenus.get(interaction.customId)

      // Return if no select menu
      if (!selectMenu) return

      // Reply with error if missing permissions and return
      if (interaction.inCachedGuild()) {
        const permissions = checkClientPermissions(
          client,
          interaction,
          selectMenu,
        )
        if (permissions.length != 0) {
          await client.replyWithError(
            interaction,
            ErrorType.MissingPermissions,
            `Sorry ${
              interaction.member
            }, I need the following permissions for this select menu:\n \`\`\`diff\n- ${permissions.join(
              '\n- ',
            )}\`\`\``,
          )
          return
        }
      }

      // Handle select menu update
      try {
        await selectMenu.run(client, interaction)
      } catch (err) {
        if (err instanceof Error) logger.error(err.stack)
        else logger.error(err)
      }
    }
  },
)
