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

const postMethod = async (apiCallUrl, info = {}) =>
  fetch(`${URL}/${apiCallUrl}`, {
    method: "POST",
    headers: info?.jwt_token
      ? { ...headers, Authorization: `Bearer ${info?.jwt_token}` }
      : { ...headers },
    body: info?.jwt_token ? "" : JSON.stringify(info),
  })
    .then(catchErrors)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
// Work with get methods
export const getEvents = async () => getMethod("infoAboutEvents");

// Work with post methods
export const signInUser = async ({ username, email, password, role }) =>
  postMethod("signInNewUser", { username, email, password, role });
export const logIn = async ({ email, password }) =>
  postMethod("logInUser", { email, password });
export const checkUserLoginned = async ({ jwt_token }) =>
  postMethod("checkUserLoginned", { jwt_token });
