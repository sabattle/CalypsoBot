const { MessageEmbed } = require('discord.js');

/**
 * Calypso's Reaction Menu class
 */
module.exports = class ReactionMenu {

  /**
   * Create new ReactionMenu
   * @param {TextChannel} channel
   * @param {GuildMember} member
   * @param {MessageEmbed} embed
   * @param {Array} arr
   * @param {int} interval 
   * @param {Object} reactions
   * @param {int} timeout 
   */
  constructor(channel, member, embed, arr = null, interval = 10, reactions = {
    '⏪': this.first.bind(this), 
    '◀️': this.previous.bind(this), 
    '▶️': this.next.bind(this), 
    '⏩': this.last.bind(this), 
    '⏹️': this.stop.bind(this)
  }, timeout = 120000) {

    /**
     * The text channel
     * @type {TextChannel}
     */
    this.channel = channel;

    /**
     * The member ID snowflake
     * @type {string}
     */
    this.memberId = member.id;

    /**
     * The embed passed to the Reaction Menu
     * @type {MessageEmbed}
     */
    this.embed = embed;

    /**
     * JSON from the embed
     * @type {Object}
     */
    this.json = this.embed.toJSON();

    /**
     * The array to be iterated over
     * @type {Array}
     */
    this.arr = arr;

    /**
     * The size of each array window
     * @type {int}
     */
    this.interval = interval;

    /**
     * The current array window start
     * @type {int}
     */
    this.current = 0;

    /**
     * The max length of the array
     * @type {int}
     */
    this.max = arr.length;

    /**
     * The reactions for menu
     * @type {Object}
     */
    this.reactions = reactions;

    /**
     * The emojis used as keys
     * @type {Array<string>}
     */
    this.emojis = Object.keys(this.reactions);

    /**
     * The collector timeout
     * @type {int}
     */
    this.timeout = timeout;

    const first = new MessageEmbed(this.json);
    const description = (this.arr) ? this.arr.slice(this.current, this.interval) : null;
    if (description) first
      .setTitle(this.embed.title + ` [1 - ${this.interval}]`)
      .setDescription(description);

    this.channel.send(first).then(message => {
      this.message = message;
      this.addReactions();
      this.createCollector();
    });
  }

  /**
   * Adds reactions to the message
   */
  async addReactions() {
    for (const emoji of this.emojis) {
      await this.message.react(emoji);
    }
  }

  /**
   * Creates a reaction collector
   */
  createCollector() {
    
    // Create collector
    const collector = this.message.createReactionCollector((reaction, user) => {
      return (this.emojis.includes(reaction.emoji.name) || this.emojis.includes(reaction.emoji.id)) &&
        user.id == this.memberId;
    }, { time: this.timeout });
    
    // On collect
    collector.on('collect', async reaction => {
      let newPage =  this.reactions[reaction.emoji.name] || this.reactions[reaction.emoji.id];
      if (typeof newPage === 'function') newPage = newPage();
      if (newPage) await this.message.edit(newPage);
      await reaction.users.remove(this.memberId);
    }); 

    // On end
    collector.on('end', () => {
      this.message.reactions.removeAll();
    });

    this.collector = collector;
  }

  /**
   * Skips to the first array interval
   */
  first() {
    if (this.current === 0) return;
    this.current = 0;
    return new MessageEmbed(this.json)
      .setTitle(this.embed.title + ` [${this.current + 1} - ${this.current + this.interval}]`)
      .setDescription(this.arr.slice(this.current, this.current + this.interval));
  }

  /**
   * Goes back an array interval
   */
  previous() {
    if (this.current === 0) return;
    this.current -= this.interval;
    if (this.current < 0) this.current = 0;
    return new MessageEmbed(this.json)
      .setTitle(this.embed.title + ` [${this.current + 1} - ${this.current + this.interval}]`)
      .setDescription(this.arr.slice(this.current, this.current + this.interval));
  }

  /**
   * Goes to the next array interval
   */
  next() {
    const cap = this.max - (this.max % this.interval);
    if (this.current === cap) return;
    this.current += this.interval;
    let max = this.current + this.interval;
    if (max >= this.max) max = this.max;
    return new MessageEmbed(this.json)
      .setTitle(this.embed.title + ` [${this.current + 1} - ${max}]`)
      .setDescription(this.arr.slice(this.current, max));
  }

  /**
   * Goes to the last array interval
   */
  last() {
    const cap = this.max - (this.max % this.interval);
    if (this.current === cap) return;
    this.current = cap;
    return new MessageEmbed(this.json)
      .setTitle(this.embed.title + ` [${this.current + 1} - ${this.max}]`)
      .setDescription(this.arr.slice(this.current, this.max));
  }

  /**
   * Stops the collector
   */
  stop() {
    this.collector.stop();
  }
};