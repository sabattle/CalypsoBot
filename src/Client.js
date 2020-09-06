const Discord = require('discord.js');
const { readdir, readdirSync } = require('fs');
const { join, resolve } = require('path');
const AsciiTable = require('ascii-table');
const { fail } = require('./utils/emojis.json');

/**
 * Calypso's custom client
 * @extends Discord.Client
 */
class Client extends Discord.Client {

  /**
   * Create a new client
   * @param {Object} config 
   * @param {ClientOptions} options 
   */
  constructor(config, options = {}) {
    
    super(options);

    /**
     * Create logger
     */
    this.logger = require('./utils/logger.js');

    /**
     * Create database
     */
    this.db = require('./utils/db.js');

    /**
     * All possible command types
     * @type {Object}
     */
    this.types = {
      INFO: 'info',
      FUN: 'fun',
      COLOR: 'color',
      POINTS: 'points',
      MISC: 'misc',
      MOD: 'mod',
      ADMIN: 'admin',
      OWNER: 'owner'
    };

    /** 
     * Collection of bot commands
     * @type {Collection<string, Command>}
     */
    this.commands = new Discord.Collection();

    /** 
     * Collection of command aliases
     * @type {Collection<string, Command>}
     */
    this.aliases = new Discord.Collection();

    /** 
     * Array of trivia topics
     * @type {Array<string>}
     */
    this.topics = [];

    /** 
     * Login token
     * @type {string}
     */
    this.token = config.token;

    /** 
     * API keys
     * @type {Object}
     */
    this.apiKeys = config.apiKeys;

    /** 
     * Calypso's owner ID
     * @type {string}
     */
    this.ownerId = config.ownerId;

    /** 
     * Calypso's bug report channel ID
     * @type {string}
     */
    this.bugReportChannelId = config.bugReportChannelId;

    /** 
     * Calypso's feedback channel ID
     * @type {string}
     */
    this.feedbackChannelId = config.feedbackChannelId;

    /** 
     * Calypso's server log channel ID
     * @type {string}
     */
    this.serverLogId = config.serverLogId;

    /** 
     * Utility functions
     * @type {Object}
     */
    this.utils = require('./utils/utils.js');

    this.logger.info('Initializing...');

  }

  /**
   * Loads all available events
   * @param {string} path 
   */
  loadEvents(path) {
    readdir(path, (err, files) => {
      if (err) this.logger.error(err);
      files = files.filter(f => f.split('.').pop() === 'js');
      if (files.length === 0) return this.logger.warn('No events found');
      this.logger.info(`${files.length} event(s) found...`);
      files.forEach(f => {
        const eventName = f.substring(0, f.indexOf('.'));
        const event = require(resolve(__basedir, join(path, f)));
        super.on(eventName, event.bind(null, this));
        delete require.cache[require.resolve(resolve(__basedir, join(path, f)))]; // Clear cache
        this.logger.info(`Loading event: ${eventName}`);
      });
    });
    return this;
  }

  /**
   * Loads all available commands
   * @param {string} path 
   */
  loadCommands(path) {
    this.logger.info('Loading commands...');
    let table = new AsciiTable('Commands');
    table.setHeading('File', 'Aliases', 'Type', 'Status');
    readdirSync(path).filter( f => !f.endsWith('.js')).forEach( dir => {
      const commands = readdirSync(resolve(__basedir, join(path, dir))).filter(f => f.endsWith('js'));
      commands.forEach(f => {
        const Command = require(resolve(__basedir, join(path, dir, f)));
        const command = new Command(this); // Instantiate the specific command
        if (command.name && !command.disabled) {
          // Map command
          this.commands.set(command.name, command);
          // Map command aliases
          let aliases = '';
          if (command.aliases) {
            command.aliases.forEach(alias => {
              this.aliases.set(alias, command);
            });
            aliases = command.aliases.join(', ');
          }
          table.addRow(f, aliases, command.type, 'pass');
        } else {
          this.logger.warn(`${f} failed to load`);
          table.addRow(f, '', '', 'fail');
          return;
        }
      });
    });
    this.logger.info(`\n${table.toString()}`);
    return this;
  }

  /**
   * Loads all available trivia topics
   * @param {string} path 
   */
  loadTopics(path) {
    readdir(path, (err, files) => {
      if (err) this.logger.error(err);
      files = files.filter(f => f.split('.').pop() === 'yml');
      if (files.length === 0) return this.logger.warn('No topics found');
      this.logger.info(`${files.length} topic(s) found...`);
      files.forEach(f => {
        const topic = f.substring(0, f.indexOf('.'));
        this.topics.push(topic);
        this.logger.info(`Loading topic: ${topic}`);
      });
    });
    return this;
  }

  /**
   * Checks if user is the bot owner
   * @param {User} user 
   */
  isOwner(user) {
    if (user.id === this.ownerId) return true;
    else return false;
  }

  /**
   * Creates and sends system failure embed
   * @param {Guild} guild
   * @param {string} error
   * @param {string} errorMessage 
   */
  sendSystemErrorMessage(guild, error, errorMessage) {

    // Get system channel
    const systemChannelId = this.db.settings.selectSystemChannelId.pluck().get(guild.id);
    const systemChannel = guild.channels.cache.get(systemChannelId);

    if ( // Check channel and permissions
      !systemChannel || 
      !systemChannel.viewable || 
      !systemChannel.permissionsFor(guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) return;

    const embed = new Discord.MessageEmbed()
      .setAuthor(`${this.user.tag}`, this.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} System Error: \`${error}\``)
      .setDescription(`\`\`\`diff\n- System Failure\n+ ${errorMessage}\`\`\``)
      .setTimestamp()
      .setColor(guild.me.displayHexColor);
    systemChannel.send(embed);
  }
}

module.exports = Client;