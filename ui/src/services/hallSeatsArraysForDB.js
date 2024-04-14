export const functionSetUpSeats = (typeOfHall) => {
  const seats = typeOfHall === "sml" ? 30 : 60;
  const hallSeats = [];
  const setUpLetter = (i) => {
    if (typeOfHall === "sml") {
      if (i <= 6) {
        return "A";
      } else if (i > 6 && i <= 16) {
        return "B";
      } else if (i > 16 && i <= 26) {
        return "C";
      } else if (i > 26 && i <= 30) {
        return "D";
      }
    } else {
      if (i <= 6) {
        return "A";
      } else if (i > 6 && i <= 16) {
        return "B";
      } else if (i > 16 && i <= 26) {
        return "C";
      } else if (i > 26 && i <= 36) {
        return "D";
      } else if (i > 36 && i <= 46) {
        return "E";
      } else if (i > 46 && i <= 56) {
        return "F";
      } else if (i > 56 && i <= 60) {
        return "G";
      }
    }
  };
  for (let i = 1; i <= seats; i++) {
    hallSeats.push({
      id: i,
      letter: setUpLetter(i),
      price: i <= 6 ? 140 : i >= seats - 4 ? 120 : 70,
      booked: "",
    });
  }
  console.log(hallSeats.length, "seats");
  return JSON.stringify(hallSeats);
};
