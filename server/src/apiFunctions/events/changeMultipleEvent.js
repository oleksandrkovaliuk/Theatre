const updatingEventsQuery = require("./query");
const db = require("../../../database");
const changeMultipleEvent = async (req, res) => {
  const { dataWithChangedEvents } = req.body;
  try {
    if (dataWithChangedEvents.length) {
      await dataWithChangedEvents.forEach((item) => {
        db.query(
          updatingEventsQuery,
          [
            item.currentName,
            item.currentDisc,
            item.id,
            item.currentDate,
            item.currentAge,
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
      Promise.all([dataWithChangedEvents])
        .then(() => {
          return res.status(200).json({ text: "your events succesfully aded" });
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
