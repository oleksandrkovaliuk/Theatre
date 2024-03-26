export const functionSetUpSeats = (typeOfHall) => {
  const seats = typeOfHall === "sml" ? 26 : 52;
  const hallSeats = [];
  for (let i = 1; i <= seats; i++) {
    hallSeats.push({ id: i });
  }
  return hallSeats;
};
