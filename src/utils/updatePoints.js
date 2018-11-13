module.exports = (client, id, guild, points = 1) => {
  let score = client.getScore.get(id, guild);
  if (!score) {
    score = { // row object
      id: id,
      guild: guild,
      points: 0
    };
  }
  score.points += points;
  client.setScore.run(score);
};
