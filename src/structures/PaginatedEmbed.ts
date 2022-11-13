import {
  ActionRowBuilder,
  ButtonBuilder,
  type ButtonInteraction,
  ButtonStyle,
  type ChatInputCommandInteraction,
  ComponentType,
  type EmbedBuilder,
  type InteractionCollector,
  type User,
} from 'discord.js'
import type { Client } from '@structures'

enum Button {
  Prev = 'prev',
  Next = 'next',
}

/**
 * Interface of all available options used for paginated embed creation.
 */
interface PaginatedEmbedOptions {
  client: Client<true>
  interaction: ChatInputCommandInteraction
  pages: EmbedBuilder[]
  time?: number
}

/**
 * The PaginatedEmbed class provides the structure for all paginated embeds with button menus.
 */
export class PaginatedEmbed {
  private readonly client: Client<true>

  private readonly interaction: ChatInputCommandInteraction

  public readonly user: User

  public pages: EmbedBuilder[]

  public readonly time: number

  #collector?: InteractionCollector<ButtonInteraction>

  public constructor({
    client,
    interaction,
    pages,
    time,
  }: PaginatedEmbedOptions) {
    this.client = client
    this.interaction = interaction
    this.user = interaction.user
    this.pages = pages
    this.time = time ?? 60000
  }

  public async run(): Promise<void> {
    const { client, interaction, user, pages, time } = this
    let index = 0

    const prev = new ButtonBuilder()
      .setCustomId(Button.Prev)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(index == 0)
      .setEmoji({ name: '◀️' })
    const next = new ButtonBuilder()
      .setCustomId(Button.Next)
      .setStyle(ButtonStyle.Primary)
      .setEmoji({ name: '▶️' })
    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(prev, next)

    const message = await client.reply(interaction, {
      embeds: [pages[index]],
      components: [row],
      fetchReply: true,
    })

    this.#collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time,
    })

    this.#collector.on('collect', async (i) => {
      if (i.user.id != user.id) return
      const { customId } = i
      switch (customId) {
        case Button.Prev: {
          index--
          break
        }
        case Button.Next: {
          index++
          break
        }
      }

      await client.update(i, {
        embeds: [pages[index]],
        components: [
          row.setComponents(
            prev.setDisabled(index == 0),
            next.setDisabled(index == pages.length - 1),
          ),
        ],
      })
    })

    this.#collector.on('end', async () => {
      await message.edit({
        embeds: [pages[index]],
        components: [],
      })
    })
  }
}
