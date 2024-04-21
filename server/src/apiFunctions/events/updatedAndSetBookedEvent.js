const db = require("../../../database");
const queryToUpdateEvents = "UPDATE events SET eventseats = $1 WHERE id = $2";
const queryToInsetNewBookedTicket =
  "INSERT INTO bookedticketsbyusers (eventid , useremail , bookedseats , daybeenbooked) VALUES($1 , $2 , $3 , $4 ) RETURNING *;";

const updatedAndSetBookedEvent = (req, res) => {
  const { eventId, eventSeats, chosenSeats, userEmail, daybeenbooked } =
    req.body;
  const valueForUpdateEvent = [eventSeats, eventId];
  const valueForAddBookedtickets = [
    eventId,
    userEmail,
    chosenSeats,
    daybeenbooked,
  ];

  if (eventSeats && eventId && chosenSeats && userEmail && daybeenbooked) {
    db.query(queryToUpdateEvents, valueForUpdateEvent, (err, dbRes) => {
      if (err) {
        return res
          .status(401)
          .json({ errorText: "failed with updating booked events" });
      } else {
        db.query(
          queryToInsetNewBookedTicket,
          valueForAddBookedtickets,
          (err, bookedTicketDbRes) => {
            if (err) {
              return res.status(401).json({
                errorText: "failed with updating bookedticketsbyusers",
              });
            }
            res.status(200).json({
              text: bookedTicketDbRes.rows[0].eventId,
            });
          }
        );
      }
    });
  } else {
    return res
      .status(401)
      .json({ errorText: "failed with getting info from request" });
  }
};

module.exports = updatedAndSetBookedEvent;
