const db = require("../../../database");
const allBookedTickets = require("../../services/getAllBookedTickets");
const deleteQuery = "DELETE FROM bookedticketsbyusers WHERE bookedseats = $1";
const deleteExpiredSeats = (req, res) => {
  const { seat, email, toShow, search, filterByTime, filterByStatus } =
    req.body;
  console.log(
    seat,
    email,
    toShow,
    search,
    filterByTime,
    filterByStatus,
    "seats"
  );
  if (seat) {
    db.query(deleteQuery, [seat], async (err) => {
      if (err) {
        return res
          .status(401)
          .json({ errorText: "failed with deleting from db" });
      } else {
        return res.status(200).json({
          tickets: await allBookedTickets(
            email,
            toShow,
            search,
            filterByTime,
            filterByStatus
          ),
        });
      }
    });
  } else {
    return res.status(401).json({ errorText: "couldnt delete seat" });
  }
};
module.exports = deleteExpiredSeats;
