const db = require("../../../database");
const events = async (req, res) => {
  try {
    db.query("SELECT * FROM events", (err, dbRes) => {
      if (err) {
        return res.status(500).json({ errorText: "Failed with getting data" });
      }
      console.log(dbRes?.rows);
      return res.status(200).json(dbRes?.rows || []);
    });
  } catch (error) {
    return res.status(500).json({ errorText: `${error} err` });
  }
};
module.exports = events;
