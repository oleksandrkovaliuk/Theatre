const db = require("../../../database");
const deleteEvent = async (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      db.query("DELETE FROM events WHERE id = $1", [id], (err, dbRes) => {
        if (err) {
          return res
            .status(401)
            .json({ errorText: "Failed with deliting event" });
        } else {
          return res.status(200).json({ text: "Success" });
        }
      });
    }
  } catch (error) {
    console.log(error, " error");
    return res
      .status(401)
      .json({ errorText: "failed with getting info about event to delete" });
  }
};
module.exports = deleteEvent;
