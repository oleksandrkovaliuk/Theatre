const getAllEvents = require("../../services/getAllEvents");

const events = async (req, res) => {
  try {
    res.status(200).json(await getAllEvents());
  } catch (error) {
    return res.status(500).json({ errorText: `${error} err` });
  }
};
module.exports = events;
