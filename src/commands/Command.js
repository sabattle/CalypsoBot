const { MessageEmbed } = require('discord.js');
const permissions = require('../utils/permissions.json');
const { fail } = require('../utils/emojis.json');

/**
 * Calypso's custom Command class
 */
class Command {

  /**
   * Create new command
   * @param {Client} client 
   * @param {Object} options 
   */
  constructor(client, options) {

    // Validate all options passed
    this.constructor.validateOptions(client, options);

    /**
     * The client
     * @type {Client}
     */
    this.client = client;

    /**
     * Name of the command
     * @type {string}
     */
    this.name = options.name;

    /**
     * Aliases of the command
     * @type {Array<string>}
     */
    this.aliases = options.aliases || null;

    /**
     * The arguments for the command
     * @type {string}
     */
    this.usage = options.usage || options.name;

    /**
     * The description for the command
     * @type {string}
     */
    this.description = options.description || '';

    /**
     * The type of command
     * @type {string}
     */
    this.type = options.type || client.types.MISC;

    /**
     * The client permissions needed
     * @type {Array<string>}
     */
    this.clientPermissions = options.clientPermissions || ['SEND_MESSAGES', 'EMBED_LINKS'];

    /**
     * The user permissions needed
     * @type {Array<string>}
     */
    this.userPermissions = options.userPermissions || null;

    /**
     * Examples of how the command is used
     * @type {Array<string>}
     */
    this.examples = options.examples || null;
    
    /**
     * If command can only be used by owner
     * @type {boolean}
     */
    this.ownerOnly = options.ownerOnly || false;

    /**
     * If command is enabled
     * @type {boolean}
     */
    this.disabled = options.disabled || false;

    /**
     * Array of error types
     * @type {Array<string>}
     */
    this.errorTypes = ['Invalid Argument', 'Command Failure'];
  }

  /**
   * Runs the command
   * @param {Message} message 
   * @param {string[]} args 
   */
  // eslint-disable-next-line no-unused-vars
  run(message, args) {
    throw new Error(`The ${this.name} command has no run() method`);
  }

  /**
   * Gets member from mention
   * @param {Message} message 
   * @param {string} mention 
   */
  getMemberFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.members.cache.get(id);
  }

  /**
   * Gets role from mention
   * @param {Message} message 
   * @param {string} mention 
   */
  getRoleFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<@&(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.roles.cache.get(id);
  }

  /**
   * Gets text channel from mention
   * @param {Message} message 
   * @param {string} mention 
   */
  getChannelFromMention(message, mention) {
    if (!mention) return;
    const matches = mention.match(/^<#(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message.guild.channels.cache.get(id);
  }

  /**
   * Helper method to check permissions
   * @param {Message} message 
   * @param {boolean} ownerOverride 
   */
  checkPermissions(message, ownerOverride = true) {
    if (!message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])) return false;
    const clientPermission = this.checkClientPermissions(message);
    const userPermission = this.checkUserPermissions(message, ownerOverride);
    if (clientPermission && userPermission) return true;
    else return false;
  }

  /**
   * Checks the user permissions
   * Code modified from: https://github.com/discordjs/Commando/blob/master/src/commands/base.js
   * @param {Message} message 
   * @param {boolean} ownerOverride 
   */
  checkUserPermissions(message, ownerOverride = true) {
    if (!this.ownerOnly && !this.userPermissions) return true;
    if (ownerOverride && this.client.isOwner(message.author)) return true;
    if (this.ownerOnly && !this.client.isOwner(message.author)) {
      return false;
    }
    
    if (message.member.hasPermission('ADMINISTRATOR')) return true;
    if (this.userPermissions) {
      const missingPermissions =
        message.channel.permissionsFor(message.author).missing(this.userPermissions).map(p => permissions[p]);
      if (missingPermissions.length !== 0) {
        const embed = new MessageEmbed()
          .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
          .setTitle(`${fail} Missing User Permissions: \`${this.name}\``)
          .setDescription(`\`\`\`diff\n${missingPermissions.map(p => `- ${p}`).join('\n')}\`\`\``)
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
        return false;
      }
    }
    return true;
  }

  /**
   * Checks the client permissions
   * @param {Message} message 
   * @param {boolean} ownerOverride 
   */
  checkClientPermissions(message) {
    const missingPermissions =
      message.channel.permissionsFor(message.guild.me).missing(this.clientPermissions).map(p => permissions[p]);
    if (missingPermissions.length !== 0) {
      const embed = new MessageEmbed()
        .setAuthor(`${this.client.user.tag}`, message.client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`${fail} Missing Bot Permissions: \`${this.name}\``)
        .setDescription(`\`\`\`diff\n${missingPermissions.map(p => `- ${p}`).join('\n')}\`\`\``)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
      return false;

    } else return true;
  }
  
  /**
   * Creates and sends command failure embed
   * @param {Message} message
   * @param {int} errorType
   * @param {string} reason 
   * @param {string} errorMessage 
   */
  sendErrorMessage(message, errorType, reason, errorMessage = null) {
    errorType = this.errorTypes[errorType];
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const embed = new MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`${fail} Error: \`${this.name}\``)
      .setDescription(`\`\`\`diff\n- ${errorType}\n+ ${reason}\`\`\``)
      .addField('Usage', `\`${prefix}${this.usage}\``)
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (this.examples) embed.addField('Examples', this.examples.map(e => `\`${prefix}${e}\``).join('\n'));
    if (errorMessage) embed.addField('Error Message', `\`\`\`${errorMessage}\`\`\``);
    message.channel.send(embed);
  }

  /**
   * Creates and sends mod log embed
   * @param {Message} message
   * @param {string} reason 
   * @param {Object} fields
   */
  async sendModLogMessage(message, reason, fields = {}) {
    const modLogId = message.client.db.settings.selectModLogId.pluck().get(message.guild.id);
    const modLog = message.guild.channels.cache.get(modLogId);
    if (
      modLog && 
      modLog.viewable &&
      modLog.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      const caseNumber = await message.client.utils.getCaseNumber(message.client, message.guild, modLog);
      const embed = new MessageEmbed()
        .setTitle(`Action: \`${message.client.utils.capitalize(this.name)}\``)
        .addField('Moderator', message.member, true)
        .setFooter(`Case #${caseNumber}`)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      for (const field in fields) {
        embed.addField(field, fields[field], true);
      }
      embed.addField('Reason', reason);
      modLog.send(embed).catch(err => message.client.logger.error(err.stack));
    }
  }

  /**
   * Validates all options provided
   * Code modified from: https://github.com/discordjs/Commando/blob/master/src/commands/base.js
   * @param {Client} client 
   * @param {Object} options 
   */
  static validateOptions(client, options) {

    if (!client) throw new Error('No client was found');
    if (typeof options !== 'object') throw new TypeError('Command options is not an Object');

    // Name
    if (typeof options.name !== 'string') throw new TypeError('Command name is not a string');
    if (options.name !== options.name.toLowerCase()) throw new Error('Command name is not lowercase');

    // Aliases
    if (options.aliases) {
      if (!Array.isArray(options.aliases) || options.aliases.some(ali => typeof ali !== 'string'))
        throw new TypeError('Command aliases is not an Array of strings');

      if (options.aliases.some(ali => ali !== ali.toLowerCase()))
        throw new RangeError('Command aliases are not lowercase');

      for (const alias of options.aliases) {
        if (client.aliases.get(alias)) throw new Error('Command alias already exists');
      }
    }

    // Usage
    if (options.usage && typeof options.usage !== 'string') throw new TypeError('Command usage is not a string');

    // Description
    if (options.description && typeof options.description !== 'string') 
      throw new TypeError('Command description is not a string');
    
    // Type
    if (options.type && typeof options.type !== 'string') throw new TypeError('Command type is not a string');
    if (options.type && !Object.values(client.types).includes(options.type))
      throw new Error('Command type is not valid');
    
    // Client permissions
    if (options.clientPermissions) {
      if (!Array.isArray(options.clientPermissions))
        throw new TypeError('Command clientPermissions is not an Array of permission key strings');
      
      for (const perm of options.clientPermissions) {
        if (!permissions[perm]) throw new RangeError(`Invalid command clientPermission: ${perm}`);
      }
    }

    // User permissions
    if (options.userPermissions) {
      if (!Array.isArray(options.userPermissions))
        throw new TypeError('Command userPermissions is not an Array of permission key strings');

      for (const perm of options.userPermissions) {
        if (!permissions[perm]) throw new RangeError(`Invalid command userPermission: ${perm}`);
      }
    }

    // Examples
    if (options.examples && !Array.isArray(options.examples))
      throw new TypeError('Command examples is not an Array of permission key strings');

    // Owner only
    if (options.ownerOnly && typeof options.ownerOnly !== 'boolean') 
      throw new TypeError('Command ownerOnly is not a boolean');

    // Disabled
    if (options.disabled && typeof options.disabled !== 'boolean') 
      throw new TypeError('Command disabled is not a boolean');
  }
}

module.exports = Command;