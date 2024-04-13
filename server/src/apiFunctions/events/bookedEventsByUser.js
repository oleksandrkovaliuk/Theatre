const db = require("../../../database");
const events = require("./events");

const bookedEventsByUser = (req, res) => {
  const { email } = req.body;

  const events = events(req, res);
};
module.exports = updateSeats;
