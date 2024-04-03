const db = require("../../../database");

const updateSeats = (req, res) => {
  const { eventSeats, id } = req.body;
  if (eventSeats && id) {
    db.query(
      "UPDATE events SET eventseats = $1 WHERE id = $2",
      [eventSeats, id],
      (err, dbRes) => {
        if (err) {
          return res
            .status(401)
            .json({ errorText: "failed with updating booked events" });
        } else {
          return res.status(200).json({ text: "succesfull" });
        }
      }
    );
  } else {
    res.status(401).json({ errorText: "failed with getting info" });
  }
};
module.exports = updateSeats;
