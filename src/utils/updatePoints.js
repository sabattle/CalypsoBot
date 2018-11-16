module.exports = (client, userID, guildID, points = 1) => {
  let score = client.getScore.get(userID, guildID);
  if (!score) {
    score = { // row object
      userID: userID,
      guildID: guildID,
      points: 0,
      totalPoints: 0
    };
  }
  score.points += points;
  score.totalPoints += points;
  client.setScore.run(score);
};
