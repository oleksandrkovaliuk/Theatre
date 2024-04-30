const getAllEvents = require("../../services/getAllEvents");

const events = async (req, res) => {
  try {
    const events = await getAllEvents();
    return res
      .status(200)
      .json(events.filter((item) => new Date(item.startingtime) > new Date()));
  } catch (error) {
    return res.status(500).json({ errorText: `${error} err` });
  }
};
module.exports = events;
