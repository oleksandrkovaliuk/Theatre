const db = require("../../../database");
const getAllEvents = require("../../services/getAllEvents");
const updatingEventsQuery = require("./query");
const changeSingleEvent = async (req, res) => {
  const {
    id,
    currentDate,
    currentAge,
    currentName,
    currentDisc,
    currentImg,
    currentHall,
  } = req.body;
  if (
    id &&
    currentDate &&
    currentAge &&
    currentName &&
    currentDisc &&
    currentImg &&
    currentHall
  ) {
    db.query(
      updatingEventsQuery,
      [
        currentName,
        currentDisc,
        id,
        currentDate,
        currentAge,
        currentImg,
        currentHall,
      ],
      async (err, dbRes) => {
        if (err) {
          return res
            .status(401)
            .json({ errorText: "Failed with updating data into events db" });
        } else {
          return res.status(200).json({
            text: "your events succesfully changed",
            events: await getAllEvents(),
          });
        }
      }
    );
  } else {
    return res
      .status(401)
      .json({ errorText: "wrong upcoming info about event" });
  }
};
module.exports = changeSingleEvent;
