import { config } from 'dotenv'
import { getEnvironmentVariable } from 'utils'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv))
  .option('debug', {
    alias: 'd',
    type: 'boolean',
    default: false,
    description: 'Run with debug mode',
  })
  .parseSync()

config()

export default {
  token: getEnvironmentVariable('TOKEN'),
  clientId: getEnvironmentVariable('CLIENT_ID'),
  guildId: getEnvironmentVariable('GUILD_ID'),
  ownerIds: getEnvironmentVariable('OWNER_IDS').split(','),
  feedbackChannelId: process.env.FEEDBACK_CHANNEL_ID ?? '',
  bugReportChannelId: process.env.BUG_REPORT_CHANNEL_ID ?? '',
  debug: argv.debug,
}
