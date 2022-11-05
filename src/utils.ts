import { type GuildMember, PermissionFlagsBits, type Role } from 'discord.js'
import startCase from 'lodash/startCase'

/**
 * Ensures an environment variable exists or throws an error.
 *
 * @remarks
 * Provides a type safe way to load environment variables.
 * Should only be used when creating the bot config.
 *
 * @param unvalidatedEnvironmentVariable - The initial environment variable before it has been type-checked
 * @returns Validated environment variable
 */
const getEnvironmentVariable = (
  unvalidatedEnvironmentVariable: string,
): string => {
  const environmentVariable = process.env[unvalidatedEnvironmentVariable]
  if (!environmentVariable) {
    throw new Error(
      `Environment variable not set: ${unvalidatedEnvironmentVariable}`,
    )
  } else {
    return environmentVariable
  }
}

/**
 * Gets a list of all permissions of the target and marks them as enabled or disabled.
 *
 * @remarks
 * This is specifically designed to be used with the `diff` syntax highlighting.
 *
 * @param target - The member or role to get permissions of
 * @returns A list of all permissions
 */
const getPermissions = (target: GuildMember | Role): string[] => {
  const rolePermissions = target.permissions.toArray() as string[]
  const allPermissions = Object.keys(PermissionFlagsBits)
  const permissions = []
  for (const permission of allPermissions) {
    if (rolePermissions.includes(permission))
      permissions.push(`+ ${startCase(permission)}`)
    else permissions.push(`- ${startCase(permission)}`)
  }
  return permissions
}

export { getEnvironmentVariable, getPermissions }
