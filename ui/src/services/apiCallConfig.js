export const URL = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api`;
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
export const getEvents = async () => getMethod("infoAboutEvents");

// Work with post methods
export const signInUser = async ({ username, email, password, role }) =>
  postMethod("signInNewUser", { username, email, password, role });
export const logIn = async ({ email, password }) =>
  postMethod("logInUser", { email, password });
export const checkUserLoginned = async () => postMethod("checkUserLoginned");
export const creatingEvent = async ({
  eventName,
  eventDisc,
  eventDate,
  eventAge,
  eventImg,
}) =>
  postMethod("createNewEvent", {
    eventName,
    eventDisc,
    eventDate,
    eventAge,
    eventImg,
  });
