const sqlite = require('sqlite');

module.exports = async (userId, guild, points = 1) => {
  try {
    let row = await sqlite.get(`SELECT * FROM ${guild} WHERE userId = ${userId}`);
    if (!row) sqlite.run(`INSERT INTO ${guild} (userId, points) VALUES (?, ?)`, [userId, points]);
    else sqlite.run(`UPDATE ${guild} SET points = ${row.points + points} WHERE userId = ${userId}`);
  }
  catch(err) {
    console.log(`Score table does not exist for ${guild}! Creating table...`);
    await sqlite.run(`CREATE TABLE IF NOT EXISTS ${guild} (userId TEXT, points INTEGER)`);
    sqlite.run(`INSERT INTO ${guild} (userId, points) VALUES (?, ?)`, [userId, points]);
  }
}
