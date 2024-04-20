const db = require("../../../database");
const queryToGetAllEvents = "SELECT * FROM events";
const queryToGetAllBookedEvents =
  "SELECT * FROM bookedticketsbyusers WHERE useremail = $1";
const bookedEventsByUser = async (req, res) => {
  const { email, amountOfItems } = req.body;
  try {
    if (!email) {
      return res.status(401).json({ errorText: "failed with getting email" });
    }
    const allEvents = (await db.query(queryToGetAllEvents)).rows;
    const allBookedSeats = await db.query(queryToGetAllBookedEvents, [email]);
    const respons = allBookedSeats.rows.reduce((acc, item) => {
      const correctItem = allEvents.find(
        (event) => event.id === Number(item.eventid)
      );
      if (correctItem) {
        acc.push({
          eventId: item.eventid,
          bookedSeats: item.bookedseats,
          beenBooked: item.daybeenbooked,
          eventName: correctItem.name,
          eventDisc: correctItem.disc,
          eventTime: correctItem.startingtime,
          eventUrl: correctItem.imgurl,
          eventAge: correctItem.age,
        });
      }
      return acc;
    }, []);
    return res.status(200).json(respons.slice(0, amountOfItems));
  } catch (error) {}
};
module.exports = bookedEventsByUser;
