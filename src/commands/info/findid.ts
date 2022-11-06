import {
  EmbedBuilder,
  GuildMember,
  Role,
  SlashCommandBuilder,
  User,
} from 'discord.js'
import Command from 'structures/Command'
import { CommandType } from 'structures/enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('findid')
    .setDescription('Finds the ID of the given user or role.')
    .addMentionableOption((option) =>
      option
        .setName('target')
        .setDescription('The target to find the ID of.')
        .setRequired(true),
    ),
  type: CommandType.Info,
  run: async (client, interaction): Promise<void> => {
    const { user, guild, options } = interaction
    const { member } = Command.getMember(interaction)
    const target = options.getMentionable('target')

    if (
      !(
        target instanceof User ||
        target instanceof GuildMember ||
        target instanceof Role
      )
    )
      return

    const embed = new EmbedBuilder()
      .setTitle('Find ID')
      .setColor(
        guild?.members.me?.displayHexColor ||
          client.user?.hexAccentColor ||
          null,
      )
      .setFields([
        { name: 'Target', value: `${target}`, inline: true },
        {
          name: 'ID',
          value: `\`${target.id}\``,
          inline: true,
        },
      ])
      .setFooter({
        text: member?.displayName || user.username,
        iconURL: member?.displayAvatarURL() || user.displayAvatarURL(),
      })
      .setTimestamp()

    await client.reply(interaction, { embeds: [embed] })
  },
})
