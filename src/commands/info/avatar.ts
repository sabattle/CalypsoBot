import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import Command from 'structures/Command'
import { CommandType } from 'structures/enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Displays a user's avatar.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to get the avatar of.')
        .setRequired(false),
    ),
  type: CommandType.Info,
  run: async (client, interaction): Promise<void> => {
    const { guild, options } = interaction
    const user = options.getUser('user') || interaction.user
    const member = interaction.inCachedGuild()
      ? guild?.members.cache.get(user.id) ||
        (await guild?.members.fetch(user.id))
      : undefined

    const embed = new EmbedBuilder()
      .setTitle(`${member?.displayName || user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ size: 512 }))
      .setColor(member?.displayHexColor || null)
      .setFooter({
        text: interaction.inCachedGuild()
          ? interaction.member.displayName
          : interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp()
    await interaction.reply({ embeds: [embed] })
  },
})
