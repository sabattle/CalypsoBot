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

export { getEnvironmentVariable }
