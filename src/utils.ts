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
