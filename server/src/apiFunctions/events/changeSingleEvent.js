const db = require("../../../database");
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
  console.log(currentImg);
  if (
    id &&
    currentDate &&
    currentAge &&
    currentName &&
    currentDisc &&
    currentImg &&
    currentHall
  ) {
    console.log(id, currentDate, currentAge, currentName, currentDisc, "info");
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
      (err, dbRes) => {
        if (err) {
          return res
            .status(401)
            .json({ errorText: "Failed with updating data into events db" });
        } else {
          db.query("SELECT * FROM events", (err, dbRes) => {
            if (err) {
              return res
                .status(500)
                .json({ errorText: "Failed with getting data" });
            }
            return res.status(200).json({
              text: "your events succesfully changed",
              events: dbRes.rows,
            });
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
