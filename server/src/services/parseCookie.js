const parseCookies = (cookies) => {
  return cookies.split(";").reduce((acc, curr) => {
    const parts = curr.split("=");
    const name = parts.shift().trim();
    const value = parts.join("=").trim();

    return {
      ...acc,
      [name]: value,
    };
  }, {});
};
module.exports = parseCookies;
