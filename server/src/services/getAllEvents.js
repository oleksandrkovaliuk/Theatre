const db = require("../../database");
const getAllEvents = async () => {
  const dbRes = await db.query("SELECT * FROM events");
  return dbRes.rows.sort((a, b) => a.id - b.id);
};
module.exports = getAllEvents;
