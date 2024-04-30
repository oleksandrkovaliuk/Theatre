const db = require("../../../database");
const createEvent = async (req, res) => {
  const {
    eventName,
    eventDisc,
    eventDate,
    eventAge,
    eventImg,
    hall,
    eventseats,
  } = req.body;
  try {
    if (!eventName || !eventDisc || !eventDate || !eventAge || !eventImg) {
      return res
        .status(401)
        .json({ errorText: "not enough info to create event" });
    }
    db.query(
      "INSERT INTO events (name , disc , startingtime , age , imgUrl , hall , eventseats) VALUES($1 , $2 , $3 , $4 , $5 , $6 , $7) RETURNING *;",
      [eventName, eventDisc, eventDate, eventAge, eventImg, hall, eventseats],
      async (err, dbRes) => {
        if (err) {
          console.log(err, "error");
          res
            .status(401)
            .json({ errorText: "failed with inserting new event into table" });
        } else {
          db.query("SELECT * FROM events", (err, dbRes) => {
            if (err) {
              return res
                .status(500)
                .json({ errorText: "Failed with getting data" });
            }
            return res.status(200).json({
              succesfull: `event "${dbRes.rows[0].name}" succesfully created`,
              events: dbRes.rows.filter(
                (item) => new Date(item.startingtime) > new Date()
              ),
            });
          });
        }
      }
    );
  } catch (error) {
    return res
      .status(401)
      .json({ errorText: "failed with creating new event" });
  }
};
module.exports = createEvent;
