const db = require("../../database");
const formatTime = require("./formatTime");
const queryToGetAllEvents = "SELECT * FROM events";
const queryToGetAllBookedEvents =
  "SELECT * FROM bookedticketsbyusers WHERE useremail = $1";
const allBookedTickets = async (
  email,
  toShow,
  search,
  filterByTime,
  filterByStatus
) => {
  const checkForThePastTime = (itemTime, time) => {
    const date = new Date();
    const past24h = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    const pastWeek = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
    const pastMonth = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
    console.log(itemTime > past24h && itemTime <= date, "data");
    if (time === "Past 24h") {
      return new Date(itemTime) > past24h && new Date(itemTime) <= date;
    } else if (time === "Past week") {
      return new Date(itemTime) > pastWeek && new Date(itemTime) <= date;
    } else if (time === "Past month") {
      return new Date(itemTime) > pastMonth && new Date(itemTime) <= date;
    }
    return false;
  };

  const allEvents = (await db.query(queryToGetAllEvents)).rows;
  const allBookedSeats = await db.query(queryToGetAllBookedEvents, [email]);
  let respons = allBookedSeats.rows.reduce((acc, item) => {
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
  if (filterByStatus || search || filterByTime) {
    if (search) {
      respons = respons.filter((item) => {
        const itemName = item.eventName.toLowerCase();
        const searchRequest = search?.toLowerCase();
        return itemName.startsWith(searchRequest) || itemName === searchRequest;
      });
    }
    if (filterByTime) {
      console.log(filterByTime !== "All time", "check");
      if (filterByTime !== "All time") {
        respons = respons.filter((item) =>
          checkForThePastTime(item.beenBooked, filterByTime)
        );
      }
    }
    if (filterByStatus) {
      if (filterByStatus !== "all") {
        if (filterByStatus === "active") {
          respons = respons.filter(
            (item) => new Date(item.eventTime) > new Date()
          );
        } else if (filterByStatus === "finished") {
          respons = respons.filter(
            (item) => new Date(item.eventTime) < new Date()
          );
        }
      }
    }
  }

  return respons
    .sort((a, b) => new Date(b.beenBooked) - new Date(a.beenBooked))
    .slice(0, toShow);
};
module.exports = allBookedTickets;
