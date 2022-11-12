import { Collection, type Snowflake } from 'discord.js'
import type { Config } from '@prisma/client'
import prisma from 'prisma'

export class ConfigCache extends Collection<Snowflake, Config | undefined> {
  /**
   * Gets a cached guild config or fetches it from the database if not present.
   *
   * @param guildId - The ID of the guild to get or fetch
   * @returns The cached config
   */
  public async fetch(guildId: Snowflake): Promise<Config | undefined> {
    if (!this.has(guildId)) {
      super.set(
        guildId,
        (await prisma.guild.findUnique({ where: { guildId } }))?.config,
      )
    }
    return super.get(guildId)
  }

  /**
   * Updates a cached guild config field with the given value.
   *
   * @param guildId - The ID of the guild to update
   * @param field - The field of the guild's config to update
   * @param value - The new value of the field
   */
  public async update<K extends keyof Config>(
    guildId: Snowflake,
    field: keyof Config,
    value: Config[K],
  ): Promise<void> {
    const config = await this.fetch(guildId)
    if (!config)
      throw new Error(
        `Unable to find guild in cache or database with guild ID: ${guildId}`,
      )
    config[field] = value
    await prisma.guild.update({
      where: { guildId },
      data: { config: { [field]: value } },
    })
  }
}
