export const formatTime = (time) => {
  const date = new Date(time);
  const day = date.getUTCDay();
  const month = date.toLocaleString("default", { month: "short" });

  let hours = date.getHours();
  let minutes = date.getMinutes();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  const formattedTime = day + " " + month + " " + hours + ":" + minutes;

  return formattedTime;
};
