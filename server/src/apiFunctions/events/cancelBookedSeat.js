const db = require("../../../database");
const allBookedTickets = require("../../services/getAllBookedTickets");
const queryToGetEvent = "SELECT * FROM events WHERE id = $1";
const queryToUpdateEvents = "UPDATE events SET eventseats = $1 WHERE id = $2";
const queryToDeleteFromBookedByUser =
  "DELETE FROM bookedticketsbyusers WHERE bookedseats = $1 AND eventid = $2";
const cancelBookedSeats = async (req, res) => {
  const {
    eventId,
    seatsId,
    email,
    toShow,
    search,
    filterByTime,
    filterByStatus,
  } = req.body;
  try {
    if (eventId && seatsId && email && toShow) {
      db.query(queryToGetEvent, [eventId], (err, dbRes) => {
        if (err) {
          return res
            .status(401)
            .json({ errorText: "failed with getting event" });
        }
        const updatedEventSeats = JSON.parse(dbRes.rows[0].eventseats).map(
          (seat) => {
            JSON.parse(seatsId).forEach((chosen) => {
              if (seat.id === Number(chosen.replace(/\D/g, ""))) {
                seat.booked = "";
              }
            });
            return seat;
          }
        );
        if (updatedEventSeats) {
          db.query(
            queryToUpdateEvents,
            [JSON.stringify(updatedEventSeats), eventId],
            (err) => {
              if (err) {
                return res
                  .status(401)
                  .json({ errorText: "failed with update event" });
              }
              db.query(
                queryToDeleteFromBookedByUser,
                [seatsId, eventId],
                async (err) => {
                  if (err) {
                    return res
                      .status(401)
                      .json({ errorText: "failed with deleting events" });
                  }
                  return res.status(200).json({
                    text: "your event succesfully canceled",
                    tickets: await allBookedTickets(
                      email,
                      toShow,
                      search,
                      filterByTime,
                      filterByStatus
                    ),
                  });
                }
              );
            }
          );
        }
      });
    } else {
      return res.status(401).json({
        errorText: "not enough information was provided to cancel event",
      });
    }
  } catch (error) {
    return res.status(401).json({ errorText: "couldnt cancel this event" });
  }
};
module.exports = cancelBookedSeats;
