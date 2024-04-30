const allBookedTickets = require("../../services/getAllBookedTickets");
const bookedEventsByUser = async (req, res) => {
  const { email, toShow, search, filterByTime, filterByStatus } = req.body;
  try {
    if (!email) {
      return res.status(401).json({ errorText: "failed with getting email" });
    }
    return res.status(200).json({
      tickets: await allBookedTickets(
        email,
        toShow,
        search,
        filterByTime,
        filterByStatus
      ),
    });
  } catch (error) {
    return res
      .status(401)
      .json({ errorText: "failed with getting all booked events" });
  }
};
module.exports = bookedEventsByUser;
