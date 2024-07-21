import { EmbedFieldData, MessageEmbedOptions, User } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { Command } from '@structures/Command';

export default new Command({
  data: {
    name: 'avatar',
    description: "Displays a user's avatar.",
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'The user to get the avatar of.',
        required: false,
      },
    ],
  },
  run: async (client, interaction: CommandInteraction): Promise<void> => {
    const targetUser = interaction.options.getUser('user') ?? interaction.user;

    const embedOptions: MessageEmbedOptions = {
      title: `${targetUser.username}'s Avatar`,
      image: {
        url: targetUser.displayAvatarURL({ size: 512, dynamic: true }),
      },
      footer: {
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      },
      timestamp: new Date(),
    };

    const color = await getColor(targetUser);
    if (color) {
      embedOptions.color = color;
    }

    await interaction.reply({ embeds: [embedOptions] });
  },
});

async function getColor(user: User): Promise<number | undefined> {
  try {
    const guilds = user.client.guilds.cache.filter((guild) => guild.members.cache.has(user.id));
    for (const guild of guilds.values()) {
      const member = await guild.members.fetch(user.id);
      if (member.displayHexColor !== '#000000') {
        return member.displayColor;
      }
    }
  } catch (error) {
    console.error(`Failed to get color for user ${user.id}:`, error);
  }
}
