import { EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js'
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
    const { user, guild, options } = interaction
    let member: GuildMember | undefined
    const targetUser = options.getUser('user') || user
    let targetMember: GuildMember | undefined
    if (interaction.inCachedGuild()) {
      member = interaction.member
      targetMember =
        guild?.members.cache.get(user.id) ||
        (await guild?.members.fetch(user.id))
    }

    const embed = new EmbedBuilder()
      .setTitle(`${targetMember?.displayName || targetUser.username}'s Avatar`)
      .setColor(
        targetMember?.displayHexColor || targetUser.hexAccentColor || null,
      )
      .setImage(
        member?.displayAvatarURL({ size: 512 }) ||
          user.displayAvatarURL({ size: 512 }),
      )
      .setFooter({
        text: member?.displayName || user.username,
        iconURL: member?.displayAvatarURL() || user.displayAvatarURL(),
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
})
