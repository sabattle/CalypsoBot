import {
  ActionRowBuilder,
  type ButtonBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  type SelectMenuComponent,
  type SelectMenuInteraction,
} from 'discord.js'
import capitalize from 'lodash/capitalize'
import { CommandType } from 'enums'
import { Component } from '@structures'
import { descriptions } from '@commands/information/help'

export default new Component<SelectMenuInteraction>({
  customId: 'help',
  run: async (client, interaction): Promise<void> => {
    const {
      message: { embeds, components },
    } = interaction

    const type = interaction.values[0]

    const commands = client.commands.filter((command) => command.type == type)

    const embed = EmbedBuilder.from(embeds[0])
      .setTitle(`**${capitalize(type)} [${commands.size}]**`)
      .setFields(
        commands.map((command) => {
          return {
            name: `\`${command.data.name}\``,
            value: command.data.description,
            inline: true,
          }
        }),
      )

    const rows = [
      ActionRowBuilder.from(components[0]).setComponents(
        SelectMenuBuilder.from(
          components[0].components[0] as SelectMenuComponent,
        ).setOptions(
          Object.entries(CommandType).map(([key, value]) => ({
            label: key,
            value,
            description: descriptions[value],
            default: value === type,
          })),
        ),
      ) as ActionRowBuilder<SelectMenuBuilder>,
      ActionRowBuilder.from(components[1]) as ActionRowBuilder<ButtonBuilder>,
    ]

    await client.update(interaction, { embeds: [embed], components: [...rows] })
  },
})
