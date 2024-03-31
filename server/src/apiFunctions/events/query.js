const updatingEventsQuery =
  "UPDATE events SET name = $1 ,  disc = $2 , startingtime = $4 , age = $5 , imgurl = $6 , eventseats = $7 WHERE id = $3";
module.exports = updatingEventsQuery;
