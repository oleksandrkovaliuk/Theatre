const db = require("../../../database");
const queryToGetAllEvents = "SELECT * FROM events";
const queryToGetAllBookedEvents =
  "SELECT * FROM bookedticketsbyusers WHERE useremail = $1";
const bookedEventsByUser = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(401).json({ errorText: "failed with getting email" });
    }
    const allEvents = (await db.query(queryToGetAllEvents)).rows;
    const allBookedSeats = await db.query(queryToGetAllBookedEvents, [email])
      .rows;
    return res.status(200).json({ a: allEvents, b: allBookedSeats });
  } catch (error) {}
};
module.exports = bookedEventsByUser;
