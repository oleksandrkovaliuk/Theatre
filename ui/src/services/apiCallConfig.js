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
    headers: {
      ...headers,
    },
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
export const signInUser = async ({ username, email, password, role }) =>
  postMethod("signIn", { username, email, password, role });
export const logIn = async ({ email, password }) =>
  postMethod("logIn", { email, password });

// Working with modifying events (Admin side)
export const checkUserLoginned = async () => postMethod("checkLoginned");
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
export const updateBookedEvents = ({ id, eventSeats }) =>
  postMethod("updateSeats", { id, eventSeats });
// Work with payment

export const getConfig = () => getMethod("stripe_config");
export const createPaymentIntent = ({ amount }) =>
  postMethod("create_payment_intent", { amount });
