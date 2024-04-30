const db = require("../../../database");
const getAllEvents = require("../../services/getAllEvents");
const deleteEvent = async (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      db.query("DELETE FROM events WHERE id = $1", [id], async (err, dbRes) => {
        if (err) {
          return res
            .status(401)
            .json({ errorText: "Failed with deliting event" });
        } else {
          const events = await getAllEvents();
          return res.status(200).json({
            text: "your events succesfully changed",
            events: events.filter(
              (item) => new Date(item.startingtime) > new Date()
            ),
          });
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
