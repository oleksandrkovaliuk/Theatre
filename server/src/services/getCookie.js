const parseCookies = (cookies) => {
  return cookies.split(";").reduce((acc, curr) => {
    const [name, value] = curr.split("=");
    return {
      ...acc,
      [name]: value,
    };
  }, {});
};

const getCookie = (req, res) => {
  try {
    console.log(req.headers.cookies);
    const cookie = parseCookies(req.headers.cookies).test;
    console.log(cookie, " cookies test");
    // const cookie = req.session[process.env.COOKIE_NAME];
    if (cookie) {
      return res.status(200).json({ cookie });
    }
    return res.status(401).json({ errorText: "failed with getting cookie" });
  } catch (error) {
    return res.status(401).json({ errorText: "failed with getting cookie" });
  }
};
module.exports = getCookie;
