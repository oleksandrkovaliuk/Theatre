export const URL = `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api`;
async function catchErrors(res) {
  if (!res.ok) {
    const resMess = res?.json();
    throw Error(resMess?.errorText || resMess?.statusText);
  }
  return res;
}
const headers = {
  "Content-Type": "application/json",
};
const getMethod = async (apiCall) =>
   fetch(`${URL}/${apiCall}`, {
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
export const getEvents = async () => getMethod("infoAboutEvents");
