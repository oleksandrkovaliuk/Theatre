export const URL = process.env.REACT_APP_SERVER_PORT;
async function catchErrors(res) {
  if (!res.ok) {
    const resMess = await res?.json();
    throw Error(resMess?.errorText || resMess?.statusText);
  }
  return res;
}
const headers = {
  "Content-Type": "application/json",
};

const getMethod = async (apiCallUrl) =>
  fetch(`${URL}/${apiCallUrl}`, {
    method: "GET",
    headers: { ...headers },
    // credentials: "include",
  })
    .then(catchErrors)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
const postMethod = async (apiCallUrl, info = {}) => {
  const jwtToken = localStorage.getItem("user_jwt_token");

  return fetch(`${URL}/${apiCallUrl}`, {
    method: "POST",
    headers: jwtToken
      ? { ...headers, Authorization: `Bearer ${jwtToken}` }
      : { ...headers },
    body: JSON.stringify(info),
  })
    .then(catchErrors)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};
// Work with get methods
export const getEvents = async () => getMethod("events");
// Work with post methods

// Working with autorisation

export const checkLoginned = async () => postMethod("checkLoginned");

export const signInUser = async ({
  username,
  email,
  password,
  role,
  jwt_user,
}) => postMethod("signIn", { username, email, password, role, jwt_user });

export const logIn = async ({ email, password, jwt_user }) =>
  postMethod("logIn", { email, password, jwt_user });

// Working with modifying events (Admin side)
export const creatingEvent = async ({
  eventName,
  eventDisc,
  eventDate,
  eventAge,
  eventImg,
  hall,
  eventseats,
}) =>
  postMethod("createEvent", {
    eventName,
    eventDisc,
    eventDate,
    eventAge,
    eventImg,
    hall,
    eventseats,
  });

export const callForChangeSingleEvent = ({
  id,
  currentDate,
  currentAge,
  currentName,
  currentDisc,
  currentImg,
  currentHall,
}) =>
  postMethod("changeSingleEvent", {
    id,
    currentDate,
    currentAge,
    currentName,
    currentDisc,
    currentImg,
    currentHall,
  });

export const callForChangeMultipleEvents = ({ dataWithChangedEvents }) =>
  postMethod("changeMultipleEvents", { dataWithChangedEvents });

export const callToDeleteEvent = ({ id }) => {
  postMethod("deleteEvent", { id });
};

export const updatedAndSetBookedEvent = ({
  eventId,
  eventSeats,
  chosenSeats,
  userEmail,
  daybeenbooked,
}) =>
  postMethod("updatedAndSetBookedEvent", {
    eventId,
    eventSeats,
    chosenSeats,
    userEmail,
    daybeenbooked,
  });

export const cancelBookedSeat = ({
  eventId,
  seatsId,
  email,
  toShow,
  search,
  filterByTime,
  filterByStatus,
}) =>
  postMethod("cancelSeat", {
    eventId,
    seatsId,
    email,
    toShow,
    search,
    filterByTime,
    filterByStatus,
  });

export const bookedEventsByUser = ({
  email,
  toShow,
  search,
  filterByTime,
  filterByStatus,
}) =>
  postMethod("bookedEventsByUser", {
    email,
    toShow,
    search,
    filterByTime,
    filterByStatus,
  });

export const deleteExpiredSeat = ({
  seat,
  email,
  toShow,
  search,
  filterByTime,
  filterByStatus,
}) =>
  postMethod("deleteExpiredSeat", {
    seat,
    email,
    toShow,
    search,
    filterByTime,
    filterByStatus,
  });
// Work with payment

export const getConfig = () => getMethod("stripe_config");

export const createPaymentIntent = ({ amount }) =>
  postMethod("create_payment_intent", { amount });

export const sendTicket = ({ username, email, ticket }) =>
  postMethod("sendUserTicket", { username, email, ticket });
// services
export const checkGitHubUser = () => getMethod("checkGitHubUser");
export const setCookies = () => getMethod("setCookies");
export const getCookies = () => getMethod("getCookie");
