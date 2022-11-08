import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import Command from 'structures/Command'
import { CommandType } from 'structures/enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('servericon')
    .setDescription("Displays the server's icon.")
    .setDMPermission(false),
  type: CommandType.Info,
  run: async (client, interaction): Promise<void> => {
    if (!interaction.inCachedGuild()) return
    const { guild, member } = interaction
    const embed = new EmbedBuilder()
      .setTitle(`${guild.name}'s Icon`)
      .setColor(
        guild.members.me?.displayHexColor ?? client.user.hexAccentColor ?? null,
      )
      .setImage(guild.iconURL({ size: 512 }))
      .setFooter({
        text: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setTimestamp()

    await client.reply(interaction, { embeds: [embed] })
  },
})
