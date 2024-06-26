const updatingEventsQuery = require("./query");
const db = require("../../../database");
const getAllEvents = require("../../services/getAllEvents");
const changeMultipleEvent = async (req, res) => {
  const { dataWithChangedEvents } = req.body;
  try {
    if (dataWithChangedEvents.length) {
      await dataWithChangedEvents.forEach((item) => {
        console.log(item.currentName);
        db.query(
          updatingEventsQuery,
          [
            item.currentName,
            item.currentDisc,
            item.id,
            item.currentDate,
            item.currentAge,
            item.currentImg,
            // item.currentHallInfo,
            item.currentHall,
          ],
          (err) => {
            if (err) {
              console.log(err, "error");
            } else {
              console.log("succesfully changed");
            }
          }
        );
      });
      const events = await getAllEvents();
      Promise.all([dataWithChangedEvents, events])
        .then(() => {
          return res.status(200).json({
            text: "your events succesfully changed",
            events: events.filter(
              (item) => new Date(item.startingtime) > new Date()
            ),
          });
        })
        .catch((err) => {
          return res.status(401).json({ errorText: err });
        });
    }
  } catch (error) {
    return res.status(401).json({ errorText: "failed with getting data" });
  }
};
module.exports = changeMultipleEvent;
