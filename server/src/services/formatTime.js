const formatTime = (time) => {
  const timecheck = Date.parse(time);
  if (isNaN(timecheck)) {
    return "invalid date";
  }
  const date = new Date(time);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  let hours = date.getHours();
  let minutes = date.getMinutes();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  const formattedTime = day + " " + month + " " + hours + ":" + minutes;

  return formattedTime;
};

module.exports = formatTime;
