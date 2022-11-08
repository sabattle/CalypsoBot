import {
  ActionRowBuilder,
  type ButtonBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  type SelectMenuComponent,
} from 'discord.js'
import capitalize from 'lodash/capitalize'
import { CommandType } from 'structures/enums'
import SelectMenu from 'structures/SelectMenu'

export default new SelectMenu({
  customId: 'help',
  run: async (client, interaction): Promise<void> => {
    const {
      message: { embeds, components },
    } = interaction

    const type = interaction.values[0]

    const commands = client.commands.filter((command) => command.type == type)

    const embed = EmbedBuilder.from(embeds[0]).setFields({
      name: `**${capitalize(type)} [${commands.size}]**`,
      value: commands
        .map(
          (command) =>
            `\`${command.data.name}\` **-** ${command.data.description}`,
        )
        .join('\n'),
    })

    const rows = [
      ActionRowBuilder.from(components[0]).setComponents(
        SelectMenuBuilder.from(
          components[0].components[0] as SelectMenuComponent,
        ).setOptions(
          Object.entries(CommandType).map(([key, value]) => ({
            label: key,
            value,
            default: value === type,
          })),
        ),
      ) as ActionRowBuilder<SelectMenuBuilder>,
      ActionRowBuilder.from(components[1]) as ActionRowBuilder<ButtonBuilder>,
    ]
    await interaction.update({ embeds: [embed], components: [...rows] })
  },
})
