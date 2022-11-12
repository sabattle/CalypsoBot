import { oneLine, stripIndents } from 'common-tags'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  type User,
} from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, Emoji, Image, Url } from 'enums'
import { dependencies, version } from '../../../package.json'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Displays bot information.'),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const {
      users,
      user: { id },
      ownerIds,
    } = client
    const { member } = Command.getMember(interaction)

    const botOwners: User[] = []
    for (const id of ownerIds) {
      botOwners.push(users.cache.get(id) ?? (await users.fetch(id)))
    }

    const embed = new EmbedBuilder()
      .setTitle(
        `${
          guild?.members.me?.displayName ?? client.user.username
        }'s Information`,
      )
      .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
      .setDescription(
        oneLine`
          Calypso is an open source, fully customizable Discord bot that is constantly growing.
          She comes packaged with a variety of commands and a multitude of settings that can be tailored to your server's specific needs. 
          Her codebase also serves as a base framework to easily create Discord bots of all kinds.
          She first went live on **February 22nd, 2018**.
        `,
      )
      .setFields([
        { name: 'Client ID', value: `\`${id}\``, inline: true },
        {
          name: `Developers ${Emoji.Owner}`,
          value: botOwners.join('\n'),
          inline: true,
        },
        {
          name: 'Tech',
          value: stripIndents`\`\`\`asciidoc
            Version     :: ${version}
            Library     :: Discord.js v${
              dependencies['discord.js'].substring(1) || ''
            }
            Environment :: Node.js ${process.version}
            Database    :: MongoDB
          \`\`\``,
        },
      ])
      .setImage(Image.CalypsoTitle)
      .setFooter({
        text: member?.displayName ?? user.username,
        iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
      })
      .setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
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
    )

    await client.reply(interaction, { embeds: [embed], components: [row] })
  },
})
