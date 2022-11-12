import { oneLine } from 'common-tags'
import {
  type APIApplicationCommandOptionChoice,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SelectMenuBuilder,
  SlashCommandBuilder,
} from 'discord.js'
import capitalize from 'lodash/capitalize'
import { Command } from '@structures'
import { Color, CommandType, Image, Url } from 'enums'

export const descriptions = {
  [CommandType.Information]: 'Commands that provide various information.',
  [CommandType.Fun]: 'Commands for fun and games.',
  [CommandType.Animals]:
    'Commands that display animal pictures or get animal facts.',
  [CommandType.Color]: 'Commands for manipulating your Discord color.',
  [CommandType.Miscellaneous]: 'Commands that do not belong to any other type.',
}

const categories: APIApplicationCommandOptionChoice<string>[] = Object.entries(
  CommandType,
).map(([key, value]) => ({ name: key, value }))

export default new Command({
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription(
      oneLine`
        Lists all available commands, sorted by type.
        Provide a type for additional information.
      `,
    )
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('The type to list the commands of.')
        .setChoices(...categories)
        .setRequired(false),
    ),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    const { user, guild, options } = interaction
    const { member } = Command.getMember(interaction)

    const embed = new EmbedBuilder()
      .setTitle(
        `${guild?.members.me?.displayName ?? client.user.username}'s Commands`,
      )
      .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
      .setImage(Image.CalypsoTitle)
      .setFooter({
        text: member?.displayName ?? user.username,
        iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
      })
      .setTimestamp()

    const type = options.getString('type')
    if (type) {
      const commands = client.commands.filter((command) => command.type == type)
      embed.setFields({
        name: `**${capitalize(type)} [${commands.size}]**`,
        value: commands
          .map(
            (command) =>
              `\`${command.data.name}\` **-** ${command.data.description}`,
          )
          .join('\n'),
      })
    } else {
      // Get all commands
      const commands: { [key in CommandType]: string[] } = {
        [CommandType.Information]: [],
        [CommandType.Fun]: [],
        [CommandType.Animals]: [],
        [CommandType.Color]: [],
        [CommandType.Miscellaneous]: [],
      }

      client.commands.forEach((command) => {
        commands[command.type].push(`\`${command.data.name}\``)
      })

      for (const [key, value] of Object.entries(commands)) {
        embed.addFields([
          {
            name: `**${capitalize(key)} [${value.length}]**`,
            value: value.join(' '),
          },
        ])
      }
    }

    const rows = [
      new ActionRowBuilder<SelectMenuBuilder>().setComponents(
        new SelectMenuBuilder().setCustomId('help').setOptions(
          Object.entries(CommandType).map(([key, value]) => ({
            label: key,
            value,
            description: descriptions[value],
            default: value === type,
          })),
        ),
      ),
      new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setURL(Url.Invite)
          .setLabel('Invite Me'),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setURL(Url.SupportServer)
          .setLabel('Server'),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setURL(Url.GithubRepository)
          .setLabel('GitHub'),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setURL(Url.Donate)
          .setLabel('Donate'),
      ),
    ]

    await client.reply(interaction, {
      embeds: [embed],
      components: [...rows],
      ephemeral: true,
    })
  },
})
