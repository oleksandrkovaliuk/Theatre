const db = require("../../database");
const formatTime = require("./formatTime");
const getAllEvents = async () => {
  const dbRes = await db.query("SELECT * FROM events");
  return dbRes.rows
    .sort((a, b) => a.id - b.id)
    .filter((item) => formatTime(item.startingtime) > formatTime(new Date()));
};
module.exports = getAllEvents;
