import { stripIndents } from 'common-tags'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, Emoji } from 'enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('memberstatus')
    .setDescription(
      'Gets how many server members are online, busy, AFK, and offline.',
    )
    .setDMPermission(false),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    if (!interaction.inCachedGuild()) return
    const { user, guild, member } = interaction
    const { members } = guild

    await members.fetch()

    // Count members by status
    const online = members.cache.filter(
      (member) => member.presence?.status === 'online',
    ).size
    const offline = members.cache.filter(
      (member) =>
        member.presence?.status === 'offline' ||
        member.presence?.status === undefined,
    ).size
    const dnd = members.cache.filter(
      (member) => member.presence?.status === 'dnd',
    ).size
    const afk = members.cache.filter(
      (member) => member.presence?.status === 'idle',
    ).size

    const embed = new EmbedBuilder()
      .setTitle(`Member Status [${members.cache.size}]`)
      .setThumbnail(guild.iconURL())
      .setColor(guild.members.me?.displayHexColor ?? Color.Default)
      .setDescription(
        stripIndents`
        ${Emoji.Online} **Online:** \`${online}\` members
        ${Emoji.Dnd} **Busy:** \`${dnd}\` members
        ${Emoji.Idle} **AFK:** \`${afk}\` members
        ${Emoji.Offline} **Offline:** \`${offline}\` members
      `,
      )
      .setFooter({
        text: member.displayName || user.username,
        iconURL: member.displayAvatarURL() || user.displayAvatarURL(),
      })
      .setTimestamp()

    await client.reply(interaction, { embeds: [embed] })
  },
})
