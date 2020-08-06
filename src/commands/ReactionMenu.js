/**
 * Calypso's Reaction Menu class
 */
module.exports = class ReactionMenu {

  /**
   * Create new ReactionMenu
   * @param {TextChannel} channel
   * @param {GuildMember} member
   * @param {MessageEmbed} embed
   * @param {Object} reactions
   * @param {int} timeout 
   */
  constructor(channel, member, embed, reactions, timeout = 120000) {

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
     * The message embed
     * @type {MessageEmbed}
     */
    this.embed = embed;

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

    this.channel.send(this.embed).then(message => {
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
      await this.message.edit(newPage);
      await reaction.users.remove(this.memberId);
    }); 

    // On end
    collector.on('end', () => {
      this.message.reactions.removeAll();
    });
  }
};